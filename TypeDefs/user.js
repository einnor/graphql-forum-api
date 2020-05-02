const { gql } = require('./node_modules/apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
    role: Role!
    avatar: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;

enum Role {
  ADMIN
  USER
}
