'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(
        models.Group,
        {
          through: models.Member,
          foreignKey: 'userId',
          otherKey: 'groupId',
          onDelete: 'cascade'
        }
      )
      User.belongsToMany(
        models.Event,
        {
          through: models.Attendee,
          foreignKey: 'userId',
          otherKey: 'eventId',
          onDelete: 'cascade'
        }
      )
      User.hasMany(
        models.Group,
        {
          foreignKey: 'organizerId',
          onDelete: 'cascade'
        }
      )
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "User with that username already exists"
      },
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email")
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "User with that email already exists"
      },
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      unique: true,
      validate: {
        len: [60, 60],
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValid(value) {
          if (!value.length) {
            const err = new Error("First name is required")
            err.status = 400
            throw err
          }
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValid(value) {
          if (!value.length) {
            const err = new Error("Last name is required")
            err.status = 400
            throw err
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  });
  return User;
};
