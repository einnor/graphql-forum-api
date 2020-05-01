const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
    role: Role!
    avatar: String!
    createdAt: String!
    updatedAt: String!
  }
`;

enum Role {
  ADMIN
  USER
}
