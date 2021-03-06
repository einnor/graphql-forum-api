const { gql } = require('apollo-server-express');

module.exports = gql`
  type Thread {
    id: ID!
    title: String!
    slug: String!
    creator: User!
    channel: Channel!
    # replies (perPgae: Int, after: String): ReplyConnection!
    replies: [Reply!]!
    status: ThreadStatus!
    isLocked: Boolean!
    lastRepliedAt: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ReplyConnection {
    edges: [Reply!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    endCursor: String,
    hasMore: Boolean!
  }

  enum ThreadStatus {
    SOLVED
    UNSOLVED
  }

  extend type Mutation {
    createThread (title: String!, content: String!, channelId: ID!) : Thread! @auth
    updateThread (id: ID!, title: String!, content: String!, channelId: ID!) : Thread! @auth
    lockThread (id: ID!) : Thread! @isAdmin
    unlockThread (id: ID!) : Thread! @isAdmin
  }

  extend type Query {
    thread (id: ID!): Thread
    threads (channelSlug: String, status: ThreadStatus, perPage: Int, page: Int): [Thread!]!
    threadsByMe (perPage: Int, page: Int): [Thread!]! @auth
  }
`;

