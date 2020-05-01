'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Channels', [
      {
        id: uuid(),
        name: 'General',
        slug: 'general',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'GraphQL',
        slug: 'graphql',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Flutter',
        slug: 'flutter',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Channels', null, {});
  }
};
