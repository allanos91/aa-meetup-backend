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
        url: 'eventimage1',
        previewImg: true
      },
      {
        eventId: 1,
        url: 'eventimage2',
        previewImg: false
      },
      {
        eventId: 1,
        url: 'eventimage3',
        previewImg: false
      },
      {
        eventId: 2,
        url: 'eventimage4',
        previewImg: true
      },
      {
        eventId: 2,
        url: 'eventimage5',
        previewImg: false
      },
      {
        eventId: 3,
        url: 'eventimage6',
        previewImg: true
      },
      {
        eventId: 3,
        url: 'eventimage7',
        previewImg: false
      },
      {
        eventId: 3,
        url: 'eventimage8',
        previewImg: false
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
