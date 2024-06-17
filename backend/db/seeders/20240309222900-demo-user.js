'use strict';
const { User } = require('../models');
const bcrypt = require("bcryptjs");
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
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Amon-Ra',
        lastName: 'St Brown'
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: "Patrick",
        lastName: "Mahomes"
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: "Christian",
        lastName: "McCaffery"
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: "Lionel The 'Goat'",
        lastName: "Messi"
      },
      {
        email: 'user4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: "Jordan",
        lastName: "Love"
      },
      {
        email: 'user5@user.io',
        username: 'FakeUser5',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: "Drake",
        lastName: "London"
      },
      {
        email: 'user6@user.io',
        username: 'FakeUser6',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: "Puka",
        lastName: "Nacua"
      },
      {
        email: 'user7@user.io',
        username: 'FakeUser7',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: "Jakobi",
        lastName: "Meyers"
      },

    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser7', 'FakeUser6', 'FakeUser5', 'FakeUser4','FakeUser3'] }
    }, {truncate: true, cascade: true ,restartIdentity: true, });
  }
};
