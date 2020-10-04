const router = require('express').Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');

const { models } = require('../database/models');
const { UserModel } = require('../database/model-names');

const validate = require('../middlewares/validator');
const checkToken = require('../middlewares/black-list');

// section only for simplify tests
const { token_black_list, refresh_token_black_list } = require('../helpers/token-black-list');

const secretAccess = config.get('jwt-secret');
const secretRefresh = config.get('refresh-secret');

const authJwt = passport.authenticate('jwt', { session: false });

router.post('/signup',
	validate('signUp'),
	async (req, res, next) => {
		const User = models[UserModel];

		const body = req.body;

		const { password, id } = body;

		try {
			const passwordHash = await User.generateHash(password);
			await User.create({ id, password: passwordHash });
		} catch (error) {
			console.error(error);

			const err = new Error();
			err.status = 500;
			return next(err);
		}

		res.status(201).json({ ok: true });
	}
);

router.post('/signin',
	passport.authenticate('local-login', { session: false }),
	(req, res) => {
		const accessToken = jwt.sign({ id: req.user.id }, secretAccess, { expiresIn: 600 });
		const refreshToken = jwt.sign({ id: req.user.id }, secretRefresh, { expiresIn: 60 * 60 * 6 });

		res.status(200).json({ accessToken, refreshToken });
	}
);

router.post('/signin/new_token',
	async (req, res, next) => {
		const User = models[UserModel];

		const body = req.body;
		const refreshToken = body.refreshToken;

		if (!refreshToken) {
			const error = new Error('Token is not defined');
			return next(error);
		}

		if (refresh_token_black_list.includes(refreshToken)) {
			const error = new Error('Token is not valid');
			error.status = 403;
			return next(error);
		}

		let payload;

		try {
			payload = jwt.verify(refreshToken, secretRefresh);
		} catch (error) {
			console.error(error);
			const err = new Error('Invalid token');
			err.status = 403;
			return next(err);
		}


		try {
			const user = await User.findOne({ where: { id: payload.id } });

			const newAccessToken = jwt.sign({ id: user.id }, secretAccess, { expiresIn: 600 });
			const newRefreshToken = jwt.sign({ id: user.id }, secretRefresh, { expiresIn: 60 * 60 * 6 });

			refresh_token_black_list.push(refreshToken);

			res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
		} catch (error) {
			console.error(error);
			const err = new Error('Internal server error');
			err.status = 403;
			next(err);
		}
	}
);

router.get('/info',
	checkToken,
	authJwt,
	async (req, res) => {
		res.send({ id: req.user.id });
	}
);

router.get('/logout',
	checkToken,
	authJwt,
	async (req, res) => {
		const authHeader = req.headers.authorization;

		token_black_list.push(authHeader);

		res.send({ success: true });
	}
);

module.exports = router;
