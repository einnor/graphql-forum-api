const { UserInputError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    createThread (parent, args, context) {
      const { models, authUser } = context;
      const { title, content, channelId } = args;

      if (!title || !content || !channelId) {
        throw new UserInputError('Missing fields');
      }

      return models.Thread.create({
        title,
        content,
        channelId,
        userId: authUser.id,
        lastRepliedAt: new Date(),
        slug: '',
      });
    },
  },
};
