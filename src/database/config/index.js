const config = require('../../config');

module.exports = {
	develop: {
		dialect: 'mysql',
		database: 'testing',
		host: config.dbHost,
		username: config.dbUser,
		password: config.dbPassword,
		port: config.dbPort,
		dialectOptions: {
			bigNumberStrings: true
		},
		logging: true
	},
	test: {
		dialect: 'sqlite',
		storage: 'test/test.sqlite',
		logging: false,
		sync: { force: true }
	}
};
