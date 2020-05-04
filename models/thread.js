'use strict';

const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequelize, DataTypes) => {
  const Thread = sequelize.define('Thread', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    channelId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('UNSOLVED', 'SOLVED'),
      allowNull: false,
      defaultValue: 'UNSOLVED'
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    lastRepliedAt: {
      type: DataTypes.DATE,
      allowNull: false
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
  Thread.associate = function(models) {
    // associations can be defined here
    Thread.belongsTo(models.User, { foreignKey: 'userId' });
    Thread.hasMany(models.Reply);
    Thread.belongsTo(models.Channel, { foreignKey: 'channelId' });
  };

  SequelizeSlugify.slugifyModel(Thread, {
    source: ['title'],
    slugOptions: { lower: true },
    column: 'slug',
    incrementalReplacement: '-',
  });

  return Thread;
};