const DataLoader = require('dataloader');
const groupBy = require('lodash/groupBy');

const models = require('../models');

const batchFavorites = async (ids, models) => {
const favorites = await models.Favorite.findAll({
    where: {
      replyId: {
        [models.Sequelize.Op.in]: ids,
      },
    },
    order: [['createdAt', 'ASC']],
  });

  const groupByReplyId = groupBy(favorites, 'replyId');

  return ids.map(id => groupByReplyId[id] || []);
};

const loader = () => new DataLoader(ids => batchFavorites(ids, models));

module.exports = loader;
