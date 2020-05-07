const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar DateTime

  directive @auth on FIELD_DEFINITION
  
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type Subscription {
    _: String
  }
`;
