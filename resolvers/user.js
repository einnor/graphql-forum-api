const { ApolloError} = require('apollo-server-express');
const jwt = require('jsonwebtoken');

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

      jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return { token };
    },
  },
};
