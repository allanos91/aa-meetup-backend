'use strict';
const { Event } = require('../models');
const event = require('../models/event');

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
      name: "Alex's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 5:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
    },
    {
      groupId: 1,
      venueId: 2,
      name: "Jordan Love's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 5:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
    },
    {
      groupId: 2,
      venueId: 3,
      name: "Amon Ra's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 5:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
    },
    {
      groupId: 2,
      venueId: 4,
      name: "Puka's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
    },
    {
      groupId: 2,
      venueId: 5,
      name: "Jessica's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
    },
    {
      groupId: 3,
      venueId: 6,
      name: "Becky's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
    },
    {
      groupId: 1,
      venueId: 7,
      name: "Keannu's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
    },
    {
      groupId: 2,
      venueId: 8,
      name: "Connor's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
    },
    {
      groupId: 1,
      venueId: 9,
      name: "Ian's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
    },
    {
      groupId: 2,
      venueId: 10,
      name: "Max's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
    },
    {
      groupId: 3,
      venueId: 11,
      name: "Drake's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
    },
    {
      groupId: 2,
      venueId: 12,
      name: "Nathan's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'desc'
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
    options.tableName = 'Events'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      type: {[Op.in]: ['Online']}
    }, {truncate: true, cascade: true ,restartIdentity: true,})
  }
};
