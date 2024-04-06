'use strict';
const { Groupimage } = require('../models')

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
   await Groupimage.bulkCreate([
    {
      groupId: 1,
      url: 'groupimage1',
      previewImg: true
    },
    {
      groupId: 1,
      url: 'groupimage2',
      previewImg: false
    },
    {
      groupId: 1,
      url: 'groupimage3',
      previewImg: false
    },
    {
      groupId: 2,
      url: 'groupimage4',
      previewImg: true
    },
    {
      groupId: 2,
      url: 'groupimage5',
      previewImg: false
    },
    {
      groupId: 3,
      url: 'groupimage6',
      previewImg: true
    },
    {
      groupId: 3,
      url: 'groupimage7',
      previewImg: false
    },
    {
      groupId: 3,
      url: 'groupimage8',
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
  }
};