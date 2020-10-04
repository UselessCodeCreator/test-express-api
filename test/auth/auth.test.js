const request = require('supertest');
const app = require('../../src/app');
const expect = require('chai').expect;

const { models } = require('../../src/database/models');
const { UserModel } = require('../../src/database/model-names');

const User = models[UserModel];

// Пример и небольшая настройка тестов.

module.exports = () => {
	describe('Signup', () => {
		const url = '/signup';

		const agent = request.agent(app);

		before(async () => {
			await User.drop();
			await User.sync({ force: true });
		});

		it('Should register new user', async () => {
			const body = {
				id: 'test@mail.com',
				password: '12345678'
			};

			const res = await agent.post(url).send(body).expect(201);

			expect(res.body).to.eql({ ok: true });
		});

		it('Should retur error if password too short', async () => {
			const body = {
				id: 'test@mail.com',
				password: '12345'
			};

			const res = await agent.post(url).send(body).expect(422);

			expect(res.body.details.length).to.equal(1);
			expect(res.body.details[0].message).to.equal('"password" length must be at least 6 characters long')
		});
	});

	describe('Signin', () => {
		const url = '/signin';

		const agent = request.agent(app);

		before(async () => {
			await User.drop();
			await User.sync({ force: true });
		});

		it('Should authorize new user', async () => {
			const body = {
				id: 'test@mail.com',
				password: '123456'
			};

			const hash = await User.generateHash('123456');

			await User.create({ password: hash, id: 'test@mail.com' });

			const access = await agent.post(url).send(body).expect(200);

			expect(access.body).to.have.property('accessToken');
			expect(access.body).to.have.property('refreshToken');
		});
	});

	describe('Info', () => {
		const signInUrl = '/signin';
		const infoUrl = '/info';

		const agent = request.agent(app);

		before(async () => {
			await User.drop();
			await User.sync({ force: true });
		});

		it('Should authorize new user', async () => {
			const body = {
				id: 'test@mail.com',
				password: '123456'
			};

			const hash = await User.generateHash('123456');

			const user = await User.create({ password: hash, id: 'test@mail.com' });

			const access = await agent.post(signInUrl).send(body).expect(200);

			expect(access.body).to.have.property('accessToken');
			expect(access.body).to.have.property('refreshToken');

			const accessToken = access.body.accessToken;

			const info = await agent.get(infoUrl).set('Authorization', `bearer ${accessToken}`).expect(200);

			expect(info.body).to.have.property('id');
			expect(info.body.id).to.equal(user.id);
		});
	});
};
