'use strict';
const { Event } = require('../models');
let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

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
      name: "Wide Reciever Clinic #1 - Fundamentals",
      type: "In Person",
      startDate: new Date('August 20, 2024 5:00:00'),
      endDate: new Date('August 20, 2024 8:00:00'),
      description: 'Learning and practicing the fundamentals of route running.'
    },
    {
      groupId: 1,
      venueId: 2,
      name: "3 on 3 Scrims",
      type: "Online",
      startDate: new Date('August 23, 2024 5:00:00'),
      endDate: new Date('August 23, 2024 8:00:00'),
      description: 'Round robin style scrimmages. 3 recievers vs 3 defenders'
    },
    {
      groupId: 2,
      venueId: 3,
      name: "Patty's chill kickback.",
      type: "Online",
      startDate: new Date('September 20, 2024 12:00:00'),
      endDate: new Date('Septmember 20, 2024 18:00:00'),
      description: 'A chill hangout where me and Trav explain how we will do it again.'
    },
    {
      groupId: 2,
      venueId: 4,
      name: "Puka's groovy hangout.",
      type: "Online",
      startDate: new Date('September 21, 2024 16:00:00'),
      endDate: new Date('September 21, 2024 17:00:00'),
      description: "A review over yesterday's kickback."
    },
    {
      groupId: 2,
      venueId: 5,
      name: "Playing catch with the boys",
      type: "Online",
      startDate: new Date('October 22, 2024 16:00:00'),
      endDate: new Date('October 22, 2024 17:00:00'),
      description: 'Today we play catch and touch grass for a solid hour. Come join the fun!'
    },
    {
      groupId: 3,
      venueId: 6,
      name: "Becky's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius exercitationem eaque ea, ducimus molestiae similique tempore cum saepe ut perspiciatis, sed amet eos quidem quia molestias voluptates necessitatibus esse ipsa!'
    },
    {
      groupId: 1,
      venueId: 7,
      name: "Keannu's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius exercitationem eaque ea, ducimus molestiae similique tempore cum saepe ut perspiciatis, sed amet eos quidem quia molestias voluptates necessitatibus esse ipsa!'
    },
    {
      groupId: 2,
      venueId: 8,
      name: "Connor's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius exercitationem eaque ea, ducimus molestiae similique tempore cum saepe ut perspiciatis, sed amet eos quidem quia molestias voluptates necessitatibus esse ipsa!'
    },
    {
      groupId: 1,
      venueId: 9,
      name: "Ian's groovy hangout.",
      type: "In person",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius exercitationem eaque ea, ducimus molestiae similique tempore cum saepe ut perspiciatis, sed amet eos quidem quia molestias voluptates necessitatibus esse ipsa!'
    },
    {
      groupId: 2,
      venueId: 10,
      name: "Max's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius exercitationem eaque ea, ducimus molestiae similique tempore cum saepe ut perspiciatis, sed amet eos quidem quia molestias voluptates necessitatibus esse ipsa!'
    },
    {
      groupId: 3,
      venueId: 11,
      name: "Drake's groovy hangout.",
      type: "Online",
      startDate: new Date('April 20, 2024 16:00:00'),
      endDate: new Date('April 20, 2024 17:00:00'),
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius exercitationem eaque ea, ducimus molestiae similique tempore cum saepe ut perspiciatis, sed amet eos quidem quia molestias voluptates necessitatibus esse ipsa!'
    },
    {
      groupId: 2,
      venueId: 12,
      name: "Nathan's groovy hangout.",
      type: "Online",
      startDate: new Date('January 20, 2025 16:00:00'),
      endDate: new Date('April 20, 2025 17:00:00'),
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius exercitationem eaque ea, ducimus molestiae similique tempore cum saepe ut perspiciatis, sed amet eos quidem quia molestias voluptates necessitatibus esse ipsa!'
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
