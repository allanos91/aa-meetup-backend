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
          through: models.Attendee,
          foreignKey: 'eventId',
          otherKey: 'userId'
        }
      )
      Event.belongsTo(
        models.Venue,
        {
          foreignKey: 'venueId'
        }
      )
      Event.belongsTo(
        models.Group,
        {
          foreignKey: 'groupId'
        }
      )
    }
  }
  Event.init({
    groupId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name must be at least 5 characters"
        }
      },
      len: {
        args: [5, 20],
        msg: "Name must be at least 5 characters"
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Type must be Online or In person"
        },
        isVal(value) {
          if (value !== "Online" && value !== "In person") {
            const err =  new Error("Type must be Online or In person")
            err.status = 400
            throw err
          }
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Start date must be in the future"
        },
        validDate(date) {
          if (date.getTime() <= Date.now()) {
            const err = new Error("Start date must be in the future")
            err.status = 400
            throw err
          }
        }
      }
    },
    endDate: DataTypes.DATE,
    description: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
