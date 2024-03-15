'use strict';
const { Member } = require('../models')
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
    await Member.bulkCreate([
      {

          userId: 1,
          eventId: 1,
          status: 'pending'

      },
      {

          userId: 2,
          eventId: 2,
          status: 'co-host'

      },
      {

          userId: 3,
          eventId: 3,
          status: 'member'

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
    return queryInterface.bulkDelete('Member', {
      status: {[Op.in]: ['member','co-host','pending']}
    })
  }
};
