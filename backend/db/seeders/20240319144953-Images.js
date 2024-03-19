'use strict';

const { Image } = require('../models')


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
    await Image.bulkCreate([
      {
        url: 'testImage 1',
        imageableId: 1,
        previewImg: false,
        imageableType: 'Group'
      },
      {
        url: 'testImage 2',
        imageableId: 1,
        previewImg: true,
        imageableType: 'Group'
      },
      {
        url: 'testImage 3',
        imageableId: 1,
        previewImg: false,
        imageableType: 'Group'
      },
      {
        url: 'testImage 4',
        imageableId: 1,
        previewImg: false,
        imageableType: 'Group'
      },

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
