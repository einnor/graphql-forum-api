'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    title: DataTypes.STRING
  }, {});
  Reply.associate = function(models) {
    // associations can be defined here
  };
  return Reply;
};