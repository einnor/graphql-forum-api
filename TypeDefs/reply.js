const { gql } = require('apollo-server-express');

module.exports = gql`
  type Reply {
    id: ID!
    title: String!
    content: String!
    user: User!
    isBestAnswer: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;