'use strict';

const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: uuid(),
      username: 'john.doe',
      email: 'john.doe@example.com',
      password: await bcrypt.hash('password', 10),
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
