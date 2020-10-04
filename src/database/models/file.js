const { FileModel } = require('../model-names');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class File extends Model {}

	File.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		filename: {
			type: DataTypes.STRING,
			allowNull: false
		},
		extension: {
			type: DataTypes.STRING,
			allowNull: false
		},
		mimetype: {
			type: DataTypes.STRING,
			allowNull: false
		},
		file_size: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		uploaded_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	}, {
		sequelize,
		modelName: FileModel,
		createdAt: false,
		updatedAt: false
	});
	return File;
};
