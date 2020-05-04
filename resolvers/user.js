const { ApolloError} = require('apollo-server-express');

module.exports = {
  Mutation: {
    async signUp (parent, args, context) {
      const { models } = context;
      const { username, email, password } = args;
      const userExists = await models.User.findOne({ where: { email } });

      if (userExists) {
        throw new ApolloError('User already exists.');
      }
    },
  },
};
