const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const basename = path.basename(__filename);

const appConfig = require('../../config');

const mode = appConfig.mode || 'develop';

const dbConfig = require('../config')[mode];

const db = {};

const sequelize = new Sequelize(dbConfig);

fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
	});


db.sequelize = sequelize;
db.models = sequelize.models;

if (mode === 'test') {
	Object.keys(db.models)
		.forEach(key => {
			db.models[key].sync({ force: true });
		});
}

module.exports = db;
