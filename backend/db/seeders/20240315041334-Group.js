'use strict';
const { Group } = require('../models')

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
    await Group.bulkCreate([
      {
        organizerId: 1,
        name:'Grouptest1',
      },
      {
        organizerId: 2,
        name: 'Grouptest2',
      },
      {
        organizerId: 3,
        name: 'Grouptest3',
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
    return queryInterface.bulkDelete('Groups', {
      name: {[Op.in]: ['Grouptest1','Grouptest2','Grouptest3']}
    })
  }
};
