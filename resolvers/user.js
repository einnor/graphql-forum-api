module.exports = {
  Mutation: {
    async signUp (parent, args, context) {
      const { models } = context;
      const { username, email, password } = args;
      const userExusts = await models.User.findOne({ where: { email } });
    },
  },
};
