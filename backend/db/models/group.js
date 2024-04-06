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
          otherKey: 'userId',
          onDelete: 'cascade',
        }
      )
      Group.belongsTo(
        models.User,
        {
          foreignKey: 'organizerId',
        }
      )
      Group.hasMany(
        models.Event,
        {
          foreignKey: 'groupId',
        }
      )
      Group.hasMany(
        models.Venue,
        {
          foreignKey: 'groupId'
        }
      )
      Group.hasMany(
        models.Groupimage,
        {
          foreignKey: 'groupId'
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
      validate: {
        len: {
          args: [1, 60],
          msg: "Name must be 60 characters or less"
        },
        notNull: {
          msg: "Name must be 60 characters or less"
        }
      }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [50, 2000],
          msg: "About must be 50 characters or more"
        },
        notNull: {
          msg: "About must be 50 characters or more"
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        valInput(value) {
          if (value !== "In person" && value !== "Online") {
            const err = new Error("Type must be 'Online' or 'In person'")
            err.status = 400
            throw err
          }
        },
        notNull: {
          msg: "Type must be 'Online' or 'In person'"
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Private must be a boolean"
        },
        isBool(value) {
          if (value !== true && value !== false) {
            const err =  new Error('Private must be a boolean')
            err.status = 400
            throw err
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "City is required"
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "State is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
