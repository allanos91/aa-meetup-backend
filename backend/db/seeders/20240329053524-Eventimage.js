'use strict';

const { Eventimage } = require('../models')
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
    await Eventimage.bulkCreate([
      {
        eventId: 1,
        url: 'https://bloximages.chicago2.vip.townnews.com/eagletribune.com/content/tncms/assets/v3/editorial/4/8c/48c9f60c-77ca-11ed-b459-4744044ed98a/639340b841971.image.jpg',
        previewImg: true
      },
      {
        eventId: 2,
        url: 'https://www.profootballhof.com/pfhof/media/Assets/NFLSchedule1050Web1.jpg?ext=.jpg',
        previewImg: true
      },
      {
        eventId: 3,
        url: 'https://www.profootballhof.com/pfhof/media/Assets/NFLSchedule1050Web1.jpg?ext=.jpg',
        previewImg: true
      },
      {
        eventId: 4,
        url: 'https://www.profootballhof.com/pfhof/media/Assets/NFLSchedule1050Web1.jpg?ext=.jpg',
        previewImg: true
      },
      {
        eventId: 5,
        url: 'https://www.profootballhof.com/pfhof/media/Assets/NFLSchedule1050Web1.jpg?ext=.jpg',
        previewImg: true
      },
      {
        eventId: 6,
        url: 'https://www.profootballhof.com/pfhof/media/Assets/NFLSchedule1050Web1.jpg?ext=.jpg',
        previewImg: true
      },
      {
        eventId: 7,
        url: 'https://www.profootballhof.com/pfhof/media/Assets/NFLSchedule1050Web1.jpg?ext=.jpg',
        previewImg: true
      },
      {
        eventId: 8,
        url: 'https://www.profootballhof.com/pfhof/media/Assets/NFLSchedule1050Web1.jpg?ext=.jpg',
        previewImg: true
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
    options.tableName = 'Eventimages'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      previewImg: {[Op.in]: [true, false]}
    }, {truncate: true, cascade: true ,restartIdentity: true,})
  }
};
