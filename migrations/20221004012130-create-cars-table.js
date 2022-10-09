'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cars', {
       id: {
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
      },
       nama: {
        type: Sequelize.STRING, 
        allowNull: false
      },
       sewa: {
        type: Sequelize.INTEGER, 
        allowNull: false
      },
       ukuran: {
        type: Sequelize.STRING, 
        allowNull: false
      },
       img: {
        type: Sequelize.STRING, 
        allowNull: false
      },
       createdAt: {
        type: Sequelize.DATE, 
        allowNull: false
      },
       updatedAt: {
        type: Sequelize.DATE, 
        allowNull: false
      }
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cars');
  }
};
