'use strict';
const { Member } = require('../models')
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
    await Member.bulkCreate([
      {
          userId: 1,
          groupId: 1,
          status: 'member'
      },
      {
        userId: 2,
        groupId: 2,
        status: 'member'
      },
      {
          userId: 2,
          groupId: 1,
          status: 'member'
      },
      {
        userId: 3,
        groupId: 3,
        status: 'member'
      },
      {
          userId: 3,
          groupId: 1,
          status: 'co-host'
      },
      {

        userId: 4,
        groupId: 2,
        status: 'member'

    },
    {
        userId: 5,
        groupId: 1,
        status: 'co-host'
    },
    {
        userId: 6,
        groupId: 3,
        status: 'member'
    },
    {
      userId: 7,
      groupId: 3,
      status: 'member'
    },
    {
      userId: 8,
      groupId: 2,
      status: 'co-host'
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
    return queryInterface.bulkDelete('Members', {
      status: {[Op.in]: ['member','co-host','pending']}
    })
  }
};
