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
   await Attendee.bulkCreate([
    {
      userId: 1,
      eventId: 1,
      status: 'attending'
    },
    {
      userId: 2,
      eventId: 1,
      status: 'attending'
    },
    {
      userId: 3,
      eventId: 1,
      status: 'attending'
    },
    {
      userId: 5,
      eventId: 1,
      status: 'pending'
    },
    {
      userId: 1,
      eventId: 2,
      status: 'attending'
    },
    {
      userId: 2,
      eventId: 2,
      status: 'attending'
    },
    {
      userId: 3,
      eventId: 2,
      status: 'attending'
    },
    {
      userId: 5,
      eventId: 2,
      status: 'pending'
    },
    {
      userId: 8,
      eventId: 3,
      status: 'attending'
    },
    {
     userId: 4,
     eventId: 3,
     status: 'attending'
    }
   ])

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Attendees'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: {[Op.in]: ['attending', 'pending','waitlist']}
    }, {truncate: true, cascade: true ,restartIdentity: true,})
  }
};
