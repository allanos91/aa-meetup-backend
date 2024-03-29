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
        city: 'Fountain Valley',
        state: 'California',
        lat: 123.41,
        lng: 123.12
      },
      {
        groupId: 1,
        address: '90210 street',
        city: 'Las Vegas',
        state: 'Nevada',
        lat: 223.41,
        lng: 413.12
      },
      {
        groupId: 1,
        address: '7658 blvd',
        city: 'Phoenix',
        state: 'Arizona',
        lat: 12.12,
        lng: 91.12
      },
      {
        groupId: 2,
        address: '21122 harbor lane',
        city: 'CastlePark',
        state: 'Missouri',
        lat: 80.01,
        lng: 67.12
      },
      {
        groupId: 2,
        address: '1212456 England st ',
        city: 'Talahassee',
        state: 'Florida',
        lat: 21.54,
        lng: 75.36
      },
      {
        groupId: 2,
        address: '7658 blvd',
        city: 'Buena Park',
        state: 'California',
        lat: 69.71,
        lng: 48.12
      },
      {
        groupId: 1,
        address: '7658 blvd',
        city: 'Phoenix',
        state: 'Arizona',
        lat: 69.71,
        lng: 48.12
      },
      {
        groupId: 3,
        address: '7658 blvd',
        city: 'Phoenix',
        state: 'Arizona',
        lat: 69.71,
        lng: 48.12
      },
      {
        groupId: 3,
        address: '7658 blvd',
        city: 'Phoenix',
        state: 'Arizona',
        lat: 69.71,
        lng: 48.12
      },
      {
        groupId: 3,
        address: '7658 blvd',
        city: 'Phoenix',
        state: 'Arizona',
        lat: 69.71,
        lng: 48.12
      },
      {
        groupId: 2,
        address: '7658 blvd',
        city: 'Phoenix',
        state: 'Arizona',
        lat: 69.71,
        lng: 48.12
      },
      {
        groupId: 1,
        address: '7658 blvd',
        city: 'Phoenix',
        state: 'Arizona',
        lat: 69.71,
        lng: 48.12
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
  }
};
