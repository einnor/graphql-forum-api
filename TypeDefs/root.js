const { gql } = require('apollo-server-express');

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
