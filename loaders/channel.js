const DataLoader = require('dataloader');

const models = require('../models');

const batchChannels = async (ids, models) => {
  const channels = await models.Channel.findAll({
    where: {
      id: {
        [models.Sequelize.Op.in]: ids,
      },
    },
  });

  return ids.map(id => channels.find(channel => channel.id === id));
};

const loader = () => new DataLoader(ids => batchChannels(ids, models));

module.exports = loader;
