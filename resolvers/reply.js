// const {} = require('apollo-server-express');

module.exports = {
  Mutation: {
    async createReply (parent, args, context) {
      const { models, authUser } = context;
      const { threadId, content } = args;
      const thread = await models.Thread.findByPk(threadId);

      const reply = await models.Reply.create({
        threadId,
        content,
        userId: authUser.id,
      });

      // await thread.update({
      //   lastRepliedAt: new Date(),
      // });

      return reply;
    }
  },
};
