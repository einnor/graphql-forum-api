const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server-express');
const bcrypt = require('bcrypt');

const { generateToken } = require('../utils');

module.exports = {
  Query: {
    async me (parent, args, context) {
      const { authUser, models } = context;
      if (!authUser) {
        throw new AuthenticationError('Unauthenticated');
      }

      return models.User.findByPk(authUser.id);
    },
  },

  Mutation: {
    async signUp (parent, args, context) {
      const { models } = context;
      const { username, email, password } = args;

      if (!username || !email || !password) {
        throw new UserInputError('Missing fields');
      }

      const userExists = await models.User.findOne({ where: { email } });

      if (userExists) {
        throw new ApolloError('User already exists.');
      }

      const user = await models.User.create({
        username,
        email,
        password,
      });

      const token = generateToken(user);

      return { token };
    },

    async signIn (parent, args, context) {
      const { models } = context;
      const { email, password } = args;

      if (!email || !password) {
        throw new UserInputError('Missing fields');
      }

      const user = await models.User.findOne({ where: { email } });

      if (!user) {
        throw new AuthenticationError('Invalid credentials.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials.');
      }

      const token = generateToken(user);

      return { token };
    },

    async updateUser (parent, args, context) {
      const { models, authUser } = context;
      const { username, email } = args;

      const user = await models.User.findByPk(authUser.id);
      await user.update({
        username,
        email,
      });

      return user;
    },

    async changePassword (parent, args, context) {
      const { models, authUser } = context;
      const { currentPassword, newPassword } = args;

      if (!currentPassword || !newPassword) {
        throw new UserInputError('Missing fields');
      }

      const user = await models.User.findByPk(authUser.id);

      const isPasswordValid = bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new ApolloError('Current password could not be verified.');
      }

      await user.update({
        password: newPassword,
      });

      return user;
    },
  },
};
