'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    threadID: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    isBestAnswer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  Reply.associate = function(models) {
    // associations can be defined here
    Reply.belongsTp(models.User, { foreignKey: 'userId' });
    Reply.belongsTp(models.Thread, { foreignKey: 'threadId' });
  };
  return Reply;
};