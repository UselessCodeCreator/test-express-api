const joi = require('joi');

const joiVars = {
	id: joi.alternatives(
		joi.string().required().email(),
		joi.string().regex(/^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s\-]?[0-9]{2}[\s-]?[0-9]{2}$/)
	),
	password: joi.string().min(6).max(20)
};

const schemas = {
	signUp: joi.object().keys({
		id: joiVars.id,
		password: joiVars.password,
	}),
	signIn: joi.object().keys({
		id: joiVars.id,
		password: joiVars.password
	})
};

function validate (schema) {
	return (req, res, next) => {
		const { error, value } = schemas[schema].validate(req.body);

		if (!error) {
			req.body = value;
			return next();
		}

		res.status(422).json(error);
	};
}

module.exports = validate;
