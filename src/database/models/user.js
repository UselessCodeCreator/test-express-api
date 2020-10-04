const { Model } = require('sequelize');
const { UserModel } = require('../model-names');

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static generateHash (password) {
			return bcrypt.hash(password, bcrypt.genSaltSync(8), null);
		}

		validPassword (password) {
			if (!password) return false;
			return bcrypt.compare(password, this.password);
		}
	}
	User.init({
		id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: UserModel,
		createdAt: false,
		updatedAt: false
	});

	return User;
};
