const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
    role: Role!
    avatar: String!
    threads: [Thread!]!
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
    changePassword(currentPassword: String!, newPassword: String!) : User!
    uploadAvatar (avatar: Upload!) : User!
  }

  extend type Query {
    me: User!
    user (username: String!) : User!
  }
`;
