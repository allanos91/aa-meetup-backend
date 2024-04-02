'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Eventimage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Eventimage.belongsTo(
        models.Event,
        {
          foreignKey: 'eventId',
          onDelete: 'cascade'
        }
      )
    }
  }
  Eventimage.init({
    eventId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    previewImg: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Eventimage',
  });
  return Eventimage;
};
