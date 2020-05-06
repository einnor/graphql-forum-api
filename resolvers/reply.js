const { ForbiddenError, ApolloError } = require('apollo-server-express');

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
        throw new ForbiddenError('The reply does not exist.');
      }

      const [ favorite ] = await models.Favorite.findOrCreate({
        where: {
          replyId: id,
          userId: authUser.id,
        }
      });

      return favorite;
    },

    async unmarkAsFavorite (parent, args, context) {
      const { models, authUser } = context;
      const { id } = args;

      const reply = await models.Reply.findByPk(id);
      if (!reply) {
        throw new ForbiddenError('The reply does not exist.');
      }

      const favorite = await models.Favorite.findOne({
        where: {
          replyId: id,
          userId: authUser.id,
        },
      });
      if (!favorite) {
        throw new ForbiddenError('The favorite does not exist.');
      }

      await favorite.destroy();

      return true;
    },

    async markAsBestAnswer (parent, args, context) {
      const { models, authUser } = context;
      const { id } = args;

      const reply = await models.Reply.findByPk(id);
      const thread = await reply.getThread();

      if (authUser.id !== thread.userId) {
        throw new ForbiddenError('You can only mark a reply as best answer on your own threads.');
      }

      await reply.update({
        isBestAnswer: true,
      });
      await thread.update({
        isResolved: true,
      });

      return reply;
    },

    async unmarkAsBestAnswer (parent, args, context) {
      const { models, authUser } = context;
      const { id } = args;

      const reply = await models.Reply.findByPk(id);
      const thread = await reply.getThread();

      if (authUser.id !== thread.userId) {
        throw new ForbiddenError('You can only unmark a reply as best answer on your own threads.');
      }

      if (!reply.isBestAnswer) {
        throw new ApolloError('The reply is not marked as favorite.');
      }

      await reply.update({
        isBestAnswer: false,
      });
      await thread.update({
        isResolved: false,
      });

      return reply;
    },

    async updateReply (parent, args, context) {
      const { models, authUser } = context;
      const { id, content } = args;

      const reply = await models.Reply.findByPk(id);
      if (authUser.id !== reply.userId) {
        throw new ForbiddenError('You can only edit your own replies.');
      }

      await reply.update({
        content,
      });

      return reply;
    },

    async deleteReply (parent, args, context) {
      const { models, authUser } = context;
      const { id } = args;

      const reply = await models.Reply.findByPk(id);
      if (authUser.id !== reply.userId) {
        throw new ForbiddenError('You can only delete your own replies.');
      }

      await reply.destroy();

      return true;
    }
  },

  Reply: {
    favorites (reply, args, context) {
      const { models } = context;
      return models.Favorite.findAll({
        where: {
          replyId: reply.id,
        }
      });
    },

    user (reply) {
      return reply.getUser();
    }
  }
};
