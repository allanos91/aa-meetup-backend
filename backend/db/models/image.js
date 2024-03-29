'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(
        models.Group,
        {
          foreignKey: 'pageId',
          constraints: false
        }
      )
      Image.belongsTo(
        models.Event,
        {
          foreignKey: 'pageId',
          constraints: false
        }
      )
    }
  }
  Image.init({
    url: DataTypes.STRING,
    pageId: DataTypes.INTEGER,
    previewImg: DataTypes.BOOLEAN,
    pageType: DataTypes.ENUM('Group', 'Event')
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
