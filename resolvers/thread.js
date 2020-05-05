const { UserInputError, ApolloError } = require('apollo-server-express');

module.exports = {
  Query: {
    async thread (parent, args, context) {
      const { models } = context;
      const { id } = args;

      const thread =  await models.Thread.findByPk(id);

      if (!thread) {
        throw new ApolloError('No thread found');
      }

      return thread;
    }
  },

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
      });
    },
  },

  Thread: {
    creator (thread) {
      return thread.getUser();
    },

    channel (thread) {
      return thread.getChannel();
    }
  },
};
