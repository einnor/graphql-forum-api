const DataLoader = require('dataloader');

const models = require('../models');

const batchReplies = async (ids, models) => {
const replies = await models.Reply.findAll({
    where: {
      id: {
        [models.Sequelize.Op.in]: ids,
      },
    },
    order: [['createdAt', 'ASC']],
  });

  return ids.map(id => replies.find(reply => reply.id === id));
};

const loader = () => new DataLoader(ids => batchReplies(ids, models));

module.exports = loader;
