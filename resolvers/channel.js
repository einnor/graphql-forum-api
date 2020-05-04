

module.exports = {
  Query: {
    allChannels (parent, args, context) {
      const { models } = context;
      return models.Channel.findAll();
    },
  },
};
