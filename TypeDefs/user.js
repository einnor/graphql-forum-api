const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
    role: Role!
    avatar: String!
    threads (page: Int, perPage: Int): [Thread!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum Role {
    ADMIN
    USER
  }
  
  type Token {
    token: String!
  }
  
  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): Token!
    signIn(email: String!, password: String!): Token!
    updateUser(username: String, email: String) : User! @auth
    changePassword(currentPassword: String!, newPassword: String!) : User! @auth
    uploadAvatar (avatar: Upload!) : User! @auth
  }

  extend type Query {
    me: User! @auth
    user (username: String!) : User!
  }
`;
