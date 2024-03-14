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
    group_id: DataTypes.INTEGER,
    venue_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
