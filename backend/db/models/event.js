'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsToMany(
        models.User,
        {
          through: 'Attendee',
          foreignKey: 'eventId',
          otherKey: 'userId'
        }
      )
      Event.hasMany(
        models.Image,
        {
          foreignKey: 'pageId',
          constraints: false,
          scope: {
            pageType: 'Event'
          }
        }
      )
    }
  }
  Event.init({
    groupId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    eventType: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
