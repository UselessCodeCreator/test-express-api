const authTest = require('./auth.test');

module.exports = () => {
	describe('Auth', () => {
		authTest();
	});
};
