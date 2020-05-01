const { gql } = require('./node_modules/apollo-server-express');

module.exports = gql`
  type Channel {
    id: ID!
    name: String!
    slug: String!
    createdAt: String!
    updatedAt: String!
  }
`;
