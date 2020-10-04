const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { UserModel } = require('../database/model-names');
const { models } = require('../database/models');

const User = models[UserModel];

const options = {
	usernameField: 'id',
	passwordField: 'password'
};

const callback = async (id, password, done) => {
	try {
		const user = await User.findOne({ where: { id } });

		const isPasswordValid = await user.validPassword(password);

		if (!user || !isPasswordValid) {
			return done({
				status: 401,
				message: 'Username or password are incorrect'
			},
			false);
		}

		done(null, user);
	} catch (error) {
		done({ message: 'Internal server error' }, false);
	}
};

const strategy = new LocalStrategy(options, callback);

passport.use('local-login', strategy);
