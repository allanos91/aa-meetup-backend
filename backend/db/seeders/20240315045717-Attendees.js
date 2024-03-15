'use strict';
const { Attendee } = require('../models')

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
    await Event.bulkCreate([
      {
        groupId: 1,
        venueId: 1,
        name: 'EventTest1',
      },
      {

        groupId: 2,
        venueId: 2,
        name: 'EventTest2'

      },
      {

        groupId: 3,
        venueId: 3,
        name: 'EventTest3'

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
  }
};
