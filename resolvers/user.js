const { ApolloError, AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { generateToken } = require('../utils');

module.exports = {
  Mutation: {
    async signUp (parent, args, context) {
      const { models } = context;
      const { username, email, password } = args;
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
    }
  },
};
