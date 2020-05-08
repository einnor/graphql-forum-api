const DataLoader = require('dataloader');

const models = require('../models');

const batchUsers = async (ids, models) => {
  const users = await models.User.findAll({
    where: {
      id: {
        [models.Sequelize.Op.in]: ids,
      },
    },
  });

  return ids.map(id => users.find(user => user.id === id));
};

const loader = new DataLoader(ids => batchUsers(ids, models));
