'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    replyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  }, {
    // Disable createdAt and updatedAt fields
    timestamos: false,
  });
  Favorite.associate = function(models) {
    // associations can be defined here
  };

  Favorite.removeAttribute('id');
  
  return Favorite;
};