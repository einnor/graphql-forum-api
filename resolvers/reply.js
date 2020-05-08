const { ForbiddenError, ApolloError } = require('apollo-server-express');

const REPLY_ADDED = 'REPLY_ADDED';
const REPLY_FAVORITED = 'REPLY_FAVORITED';
const REPLY_UNFAVORITED = 'REPLY_UNFAVORITED';
const REPLY_MARKEDED_AS_BEST_ANSWER = 'REPLY_MARKEDED_AS_BEST_ANSWER';
const REPLY_UNMARKEDED_AS_BEST_ANSWER = 'REPLY_UNMARKEDED_AS_BEST_ANSWER';

module.exports = {
  Mutation: {
    async createReply (parent, args, context) {
      const { models, authUser, pubsub } = context;
      const { threadId, content } = args;
      const thread = await models.Thread.findByPk(threadId);

      if (thread.isLocked) {
        throw new ApolloError('Thread has been locked.');
      }

      const reply = await models.Reply.create({
        threadID: threadId,
        content,
        userId: authUser.id,
      });

      await thread.update({
        lastRepliedAt: new Date(),
      });

      pubsub.publish(REPLY_ADDED, { replyAdded: reply });

      return reply;
    },

    async markAsFavorite (parent, args, context) {
      const { models, authUser, pubsub } = context;
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

      pubsub.publish(REPLY_FAVORITED, { replyFavorited: favorite });

      return favorite;
    },

    async unmarkAsFavorite (parent, args, context) {
      const { models, authUser, pubsub } = context;
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

      pubsub.publish(REPLY_UNFAVORITED, { replyUnfavorited: favorite });

      return true;
    },

    async markAsBestAnswer (parent, args, context) {
      const { models, authUser, pubsub } = context;
      const { id } = args;

      const reply = await models.Reply.findByPk(id);
      const thread = await reply.getThread();

      if (thread.isLocked) {
        throw new ApolloError('Thread has been locked.');
      }

      if (authUser.id !== thread.userId) {
        throw new ForbiddenError('You can only mark a reply as best answer on your own threads.');
      }

      await reply.update({
        isBestAnswer: true,
      });
      await thread.update({
        isResolved: true,
      });

      pubsub.publish(REPLY_MARKEDED_AS_BEST_ANSWER, { replyMarkedAsBestAnswer: reply });

      return reply;
    },

    async unmarkAsBestAnswer (parent, args, context) {
      const { models, authUser, pubsub } = context;
      const { id } = args;

      const reply = await models.Reply.findByPk(id);
      const thread = await reply.getThread();

      if (thread.isLocked) {
        throw new ApolloError('Thread has been locked.');
      }

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

      pubsub.publish(REPLY_UNMARKEDED_AS_BEST_ANSWER, { replyUnmarkedAsBestAnswer: reply });

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

  Subscription: {
    replyAdded: {
      subscribe (parent, args, context) {
        const { pubsub } = context;
        return pubsub.asyncIterator(REPLY_ADDED);
      },
    },

    replyFavorited: {
      subscribe (parent, args, context) {
        const { pubsub } = context;
        return pubsub.asyncIterator(REPLY_FAVORITED);
      },
    },

    replyUnfavorited: {
      subscribe (parent, args, context) {
        const { pubsub } = context;
        return pubsub.asyncIterator(REPLY_UNFAVORITED);
      },
    },

    replyMarkedAsBestAnswer: {
      subscribe (parent, args, context) {
        const { pubsub } = context;
        return pubsub.asyncIterator(REPLY_MARKEDED_AS_BEST_ANSWER);
      },
    },

    replyUnmarkedAsBestAnswer: {
      subscribe (parent, args, context) {
        const { pubsub } = context;
        return pubsub.asyncIterator(REPLY_UNMARKEDED_AS_BEST_ANSWER);
      },
    },
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

    user (reply, args, context) {
      // return reply.getUser();
      const { loaders } = context;
      return loaders.user.load(reply.userId);
    }
  },
};
