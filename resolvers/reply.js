const { ForbiddenError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    async createReply (parent, args, context) {
      const { models, authUser } = context;
      const { threadId, content } = args;
      const thread = await models.Thread.findByPk(threadId);

      const reply = await models.Reply.create({
        threadID: threadId,
        content,
        userId: authUser.id,
      });

      await thread.update({
        lastRepliedAt: new Date(),
      });

      return reply;
    },

    async markAsFavorite (parent, args, context) {
      const { models, authUser } = context;
      const { id } = args;

      const reply = await models.Reply.findByPk(id);
      if (!reply) {
        throw new ForbiddenError('Cannot favorite the reply.');
      }
      const [ favorite ] = models.Favorite.findOrCreate({
        where: {
          replyId: id,
          userId: authUser.id,
        }
      });

      return favorite;
    }
  },
};
