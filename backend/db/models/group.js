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
          foreignKey: 'imageableId',
          constraints: false,
          scope: {
            imageableType: 'Group'
          }
        }
      )
      Group.hasMany(
        models.Event,
        {
          foreignKey: 'groupId',
        }
      )
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 500],
          msg: "Must be greater than 4 characters and less than 500 characters"
        }
      }
    },
    groupType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
