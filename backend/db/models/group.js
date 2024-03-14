'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(
        models.User,
        {
          through: models.Member,
          foreignKey: 'groupId',
          otherKey: 'userId'
        }
      )
      Group.belongsTo(
        models.User,
        {
          foreignKey: 'organizerId',
        }
      )
      Group.hasMany(
        models.Image,
        {
          foreignKey: 'pageId',
          constraints: false,
          scope: {
            page_type: 'Group'
          }
        }
      )
      Group.belongsToMany(
        models.Venue,
        {
          through: models.Event,
          foreignKey: 'groupId',
          otherKey: 'venueId'
        }
      )
    }
  }
  Group.init({
    organizer_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    about: DataTypes.STRING,
    groupType: DataTypes.STRING,
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
