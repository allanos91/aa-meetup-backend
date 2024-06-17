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
        name: "Amon-Ra's Wide Reciever Program",
        about: "Wide reciever training grouped coached by none other than detroits best wide reciever. Join if you want to catch a ball. asdfasdfasdfasdfasdfasdfasdfasdfasdf",
        type: "In person",
        private: false,
        city: "Detroit",
        state: "MI"
      },
      {
        organizerId: 2,
        name: "Pat and his Mahomies",
        about: "A group for winners. If you aren't a winner you are not welcome. You must be a winner, no exceptions and no excuses. asdf asdfasdfasdfasdfasdfasdf",
        type: "In person",
        private: false,
        city: "Kansas City",
        state: "MO"
      },
      {
        organizerId: 3,
        name: "McCaffery's running back support network",
        about: "A place where all RBs can complain about how underpaid we are. Mom is bringing cake and cookies. asdfasdfasdfasdfasdfasdfasf",
        type: "Online",
        private: false,
        city: "San Francisco",
        state: "CA"
      },
      {
        organizerId: 4,
        name: "You know what this is about.",
        about: "A group for playing REAL football. Auto bans for anyone that calls it soccer. alskdfj alksdfj aklsdjf laksdfj alksdf jlaks",
        private: false,
        type: "In person",
        city: "Miami",
        state: "FL"
      },
      {
        organizerId: 5,
        name: "Dream team",
        about: "A group where all your dreams will come true. Even your nightmares? Especially your nightmares. Not for the faint of heart.",
        private: false,
        type: "In person",
        city: "Los Angeles",
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
      name: { [Op.in]: [] }
    }, {truncate: true, cascade: true ,restartIdentity: true,});
  }
};
