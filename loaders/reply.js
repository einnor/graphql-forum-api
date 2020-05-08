const DataLoader = require('dataloader');
const groupBy = require('lodash.groupBy');

const models = require('../models');

const batchReplies = async (ids, models) => {
const replies = await models.Reply.findAll({
    where: {
      threadId: {
        [models.Sequelize.Op.in]: ids,
      },
    },
    order: [['createdAt', 'ASC']],
  });

  const groupByThreadId = groupBy(replies, 'threadId');

  return ids.map(id => groupByThreadId[id] || []);
};

const loader = () => new DataLoader(ids => batchReplies(ids, models));

module.exports = loader;
