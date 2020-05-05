const { UserInputError, ApolloError, ForbiddenError } = require('apollo-server-express');

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
    },

    async threads (parent, args, context) {
      const { models } = context;
      return models.Thread.findAll();
    },
  },

  Mutation: {
    async createThread (parent, args, context) {
      const { models, authUser } = context;
      const { title, content, channelId } = args;

      if (!title || !content || !channelId) {
        throw new UserInputError('Missing fields');
      }

      const thread = await models.Thread.create({
        title,
        content,
        channelId,
        userId: authUser.id,
        lastRepliedAt: new Date(),
      });

      return thread;
    },

    async updateThread (parent, args, context) {
      const { models, authUser } = context;
      const { id, title, content, channelId } = args;

      if (!id || !title || !content || !channelId) {
        throw new UserInputError('Missing fields');
      }

      const thread = await models.Thread.findByPk(id);

      // Check that the authenticated user owns the thread
      if (authUser.id !== thread.userId) {
        throw new ForbiddenError('You can only edit your own threads');
      }

      await thread.update({
        title,
        content,
        channelId,
      });

      return thread;
    }
  },

  Thread: {
    creator (thread) {
      return thread.getUser();
    },

    channel (thread) {
      return thread.getChannel();
    },

    replies (thread) {
      return thread.getReplies();
    },
  },
};
