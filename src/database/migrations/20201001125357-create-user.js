module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.STRING
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			}
		});
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable('Users');
	}
};
