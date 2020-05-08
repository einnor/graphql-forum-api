const { UserInputError, ApolloError, ForbiddenError } = require('apollo-server-express');

const { encodeCursor, decodeCursor } = require('../utils');

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
      const { channelSlug, status, perPage = 15, page = 1 } = args;

      const whereOptions = {};

      if (status) {
        whereOptions.status = status;
      }

      if (channelSlug) {
        const channel = await models.Channel.findOne({
          where: {
            slug: channelSlug,
          },
        });

        if (!channel) {
          throw new ApolloError('Channel not found.');
        }

        whereOptions.channelId = channel.id;
      }
      return models.Thread.findAll({
        where: whereOptions,
        orderBy: [['lastRepliedAt', 'DESC']],
        limit: perPage,
        offset: page === 1 ? 0 : perPage * (page - 1),
      });
    },

    async threadsByMe (parent, args, context) {
      const { models, authUser } = context;
      const { perPage = 15, page = 1 } = args;

      return models.Thread.findAll({
        where: {
          userId: authUser.id,
        },
        orderBy: [['lastRepliedAt', 'DESC']],
        limit: perPage,
        offset: page === 1 ? 0 : perPage * (page - 1),
      });
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

      if (thread.isLocked) {
        throw new ApolloError('Thread has been locked.');
      }

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
    },

    async lockThread (parent, args, context) {
      const { models, authUser } = context;
      const { id } = args;

      const thread = await models.Thread.findByPk(id);

      if (thread.isLocked) {
        throw new ApolloError('Thread is already locked');
      }

      thread.update({
        isLocked: true,
      });

      return thread;
    },

    async unlockThread (parent, args, context) {
      const { models, authUser } = context;
      const { id } = args;

      const thread = await models.Thread.findByPk(id);

      if (!thread.isLocked) {
        throw new ApolloError('Thread is already unlocked');
      }

      thread.update({
        isLocked: false,
      });

      return thread;
    },
  },

  Thread: {
    creator (thread) {
      return thread.getUser();
    },

    channel (thread) {
      return thread.getChannel();
    },

    async replies (thread, args, context) {
      const { models } = context;
      const { perPage = 15, after } = args;

      const whereOptions = {
        threadId: thread.id,
      };

      if (after) {
        whereOptions.createdAt = {
          [models.Sequelize.Op.gt]: after,
        }
      }
      const { rows, count } = await models.Reply.findAndCountAll({
        where: whereOptions,
        orderBy: [['createdAt', 'ASC']],
        limit: perPage,
      });
      return {
        edges: rows,
        pageInfo: {
          endCursor: rows.length ? encodeCursor(rows[rows.length - 1].createdAt).toISOString() : null,
          hasMore: rows.length ? count > rows.length : false,
        },
      };
    },
  },
};
