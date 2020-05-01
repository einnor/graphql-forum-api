const { gql } = require('apollo-server-express');

module.exports = gql`
  type Thread {
    id: ID!
    title: String!
    slug: String!
    slug: String!
    creator: User!
    channel: Channel!
    status: ThreadStatus!
    isLocked: Boolean!
    lastRepliedAt: String!
    createdAt: String!
    updatedAt: String!
  }
`;

enum ThreadStatus {
  SOLVED
  UNSOLVED
}

