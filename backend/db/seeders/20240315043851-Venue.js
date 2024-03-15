'use strict';

const { Venue } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: '123 lane',
      },
      {

        groupId: 2,
        address: '456 drive'

      },
      {

        groupId: 3,
        address: '321 rd'

      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Venue', {
      address: {[Op.in]: ['123 lane','456 drive','321 rd']}
    })
  }
};
