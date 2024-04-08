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
        },
        len: {
          args: [5, 50000],
          msg: "Name must be at least 5 characters"
        }
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
          if (value !== "Online" && value !== "In Person") {
            const err =  new Error("Type must be Online or In Person")
            err.status = 400
            throw err
          }
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        lengthZero(value) {
          if (value.length === 0) {
            const err = new Error("Description is required")
            err.status = 400
            throw err
          }
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        isInt(value) {
          if (typeof value !== "number") {
            const err = new Error("Capacity must be an integer")
            err.status = 400
            throw err
          }
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isValid(value) {
          if (typeof value !== "number") {
            const err = new Error("Price is invalid")
            err.status =400
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
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        lessThanStartDate(value) {
          if (new Date(`${this.startDate}`).getTime() >= new Date(`${value}`).getTime()) {
            const err = new Error("End date is less than start date")
            err.status = 400
            throw err
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
