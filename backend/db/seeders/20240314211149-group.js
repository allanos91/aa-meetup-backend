'use strict';
const { Group } = require('../models');
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
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: "Alex's group1",
        about: "fun group",
        groupType: "Live",
        private: false,
        city: "Costa Mesa",
        state: "CA"
      },
      {
        organizerId: 1,
        name: "Alex's group2",
        about: "fun group",
        groupType: "Live",
        private: false,
        city: "Costa Mesa",
        state: "CA"
      },
      {
        organizerId: 1,
        name: "Alex's group3",
        about: "fun group",
        groupType: "private",
        private: false,
        city: "Costa Mesa",
        state: "CA"
      }
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Rene's group", "Nathan's group", "Alex's group"] }
    }, {});
  }
};
