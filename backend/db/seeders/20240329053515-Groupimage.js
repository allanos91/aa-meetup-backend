'use strict';
const { Groupimage } = require('../models')
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
   await Groupimage.bulkCreate([
    {
      groupId: 1,
      url: 'https://wallpapercave.com/wp/wp12076221.jpg',
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
      url: 'https://thyblackman.com/wp-content/uploads/2019/11/PatrickMahomes.jpg',
      previewImg: true
    },
    {
      groupId: 2,
      url: 'groupimage5',
      previewImg: false
    },
    {
      groupId: 3,
      url: 'https://a2.espncdn.com/combiner/i?img=%2Fphoto%2F2022%2F1024%2Fr1080744_1296x729_16-9.jpg',
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
    },
    {
      groupId: 4,
      url: 'https://blog.confirmbets.com/wp-content/uploads/2019/07/Messi.jpg',
      previewImg:true
    },
    {
      groupId: 5,
      url: 'https://www.jacketsland.com/wp-content/uploads/2023/10/Taylor-Swift-Kansas-City-Chiefs-Sweatshirt.jpg',
      previewImg: true
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
    options.tableName = 'Groupimages'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      previewImg: {[Op.in]: [true, false]}
    }, {truncate: true, cascade: true ,restartIdentity: true,})
  }
};
