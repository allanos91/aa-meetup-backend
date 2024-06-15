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
        about: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius exercitationem eaque ea, ducimus molestiae similique tempore cum saepe ut perspiciatis, sed amet eos quidem quia molestias voluptates necessitatibus esse ipsa!",
        type: "In person",
        private: false,
        city: "Costa Mesa",
        state: "CA"
      },
      {
        organizerId: 2,
        name: "Nathan's group2",
        about: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius exercitationem eaque ea, ducimus molestiae similique tempore cum saepe ut perspiciatis, sed amet eos quidem quia molestias voluptates necessitatibus esse ipsa!",
        type: "In person",
        private: false,
        city: "Costa Mesa",
        state: "CA"
      },
      {
        organizerId: 3,
        name: "Rene's group3",
        about: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius exercitationem eaque ea, ducimus molestiae similique tempore cum saepe ut perspiciatis, sed amet eos quidem quia molestias voluptates necessitatibus esse ipsa!",
        type: "Online",
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
    }, {truncate: true, cascade: true ,restartIdentity: true,});
  }
};
