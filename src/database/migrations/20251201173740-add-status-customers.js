'use strict';

/* @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.addColumn('customers', 'status', { 
      type: Sequelize.ENUM('active', 'archived'), 
      defaultValue: 'active',
      allowNull: false,
    });
  },

  async down (queryInterface) {
    return  queryInterface.Sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('customers', 'status', { transaction });
      await queryInterface.sequelize.query("DROP TYPE IF EXISTS enum_customers_status", { transaction });
    });
  }
};
