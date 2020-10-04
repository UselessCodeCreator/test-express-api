module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Files', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			filename: {
				type: Sequelize.STRING,
				allowNull: false
			},
			extension: {
				type: Sequelize.STRING,
				allowNull: false
			},
			mimetype: {
				type: Sequelize.STRING,
				allowNull: false
			},
			file_size: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			uploaded_at: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW
			}
		});
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable('Files');
	}
};
