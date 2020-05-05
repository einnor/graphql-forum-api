

module.exports = {
  Query: {
    channels (parent, args, context) {
      const { models } = context;
      return models.Channel.findAll();
    },
  },
};
