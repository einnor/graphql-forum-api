const { gql } = require('apollo-server-express');

module.exports = gql`
  type Thread {
    id: ID!
    title: String!
    slug: String!
    creator: User!
    channel: Channel!
    replies: [Reply]!
    status: ThreadStatus!
    isLocked: Boolean!
    lastRepliedAt: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum ThreadStatus {
    SOLVED
    UNSOLVED
  }

  extend type Mutation {
    createThread (title: String!, content: String!, channelId: ID!) : Thread!
    updateThread (id: ID!, title: String!, content: String!, channelId: ID!) : Thread!
    lockThread (id: ID!) : Thread!
    unlockThread (id: ID!) : Thread!
  }

  extend type Query {
    thread (id: ID!): Thread
    threads: [Thread!]!
  }
`;

