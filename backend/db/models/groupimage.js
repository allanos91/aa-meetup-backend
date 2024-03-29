'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Groupimage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Groupimage.belongsTo(
        models.Group,
        {
          foreignKey: 'groupId',
          onDelete: 'cascade'
        }
      )

    }
  }
  Groupimage.init({
    groupId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    previewImg: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Groupimage',
  });
  return Groupimage;
};
