// const {} = require('apollo-server-express');

module.exports = {
  Favorite: {
    user (favorite, args, context) {
      const { models } = context;
      return models.User.findByPk(favorite.userId);
    },

    reply (favorite, args, context) {
      const { models } = context;
      return models.Reply.findByPk(favorite.replyId);
    }
  },
};
