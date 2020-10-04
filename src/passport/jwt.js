const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const { fromAuthHeaderAsBearerToken } = require('passport-jwt').ExtractJwt;

const config = require('../config');

const { UserModel } = require('../database/model-names');
const { models } = require('../database/models');

const User = models[UserModel];

const options = {
	secretOrKey: config.get('jwt-secret'),
	jwtFromRequest: fromAuthHeaderAsBearerToken()
};

const callback = async (jwt_payload, done) => {
	try {
		const user = await User.findOne({ where: { id: jwt_payload.id } });

		if (!user) {
			return done(null, null);
		}

		done(null, user);
	} catch (error) {
		done(error, null);
	}
};

const strategy = new JwtStrategy(options, callback);

passport.use('jwt', strategy);
