'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.changeColumn('Places', 'latitude', {
				type: Sequelize.DECIMAL(10, 8),
				allowNull: false,
			}),
			queryInterface.changeColumn('Places', 'longitude', {
				type: Sequelize.DECIMAL(11, 8),
				allowNull: false,
			})
		])
	},

	async down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.changeColumn('Places', 'latitude', {
				type: Sequelize.DECIMAL,
				allowNull: false,
			}),
			queryInterface.changeColumn('Places', 'longitude', {
				type: Sequelize.DECIMAL,
				allowNull: false,
			})
		])
	}
};
