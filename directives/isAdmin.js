const { SchemaDirectiveVisitor, AuthenticationError, ApolloError } = require('apollo-server-express');

class IsAdminDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = function (...args) { // parent, args, context, info
      const { authUser } = args[2];

      if (!authUser) {
        throw new AuthenticationError('You are not authenticated.');
      }

      if (authUser.role !== 'ADMIN') {
        throw new ApolloError('You are not authorized.');
      }

      return resolve.apply(this, args);
    }
  }
}

module.exports = IsAdminDirective;
