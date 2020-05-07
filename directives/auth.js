const { SchemaDirectiveVisitor, AuthenticationError } = require('apollo-server-express');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = function (...args) { // parent, args, context, info
      const { authUser } = args[2];

      if (!authUser) {
        throw new AuthenticationError('You are not authenticated.');
      }

      return resolve.apply(this, args);
    }
  }
}

module.exports = AuthenticationError;
