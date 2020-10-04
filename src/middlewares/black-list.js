// section only for simplify tests
const { token_black_list } = require('../helpers/token-black-list');

module.exports = (req, res, next) => {
	const token = req.headers.authorization;

	if (token_black_list.includes(token)) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	next();
};
