const { gql } = require('./node_modules/apollo-server-express');

module.exports = gql`
  scalar DateTime
  
  type Query {}

  type Mutation {
    _: String
  }

  type Subscription {
    _: String
  }
`;
