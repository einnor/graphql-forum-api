const { gql } = require('apollo-server-express');

module.exports = gql`
  type Reply {
    id: ID!
    title: String!
    content: String!
    user: User!
    isBestAnswer: Boolean!
    favorites: [Favorite!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  extend type Mutation {
    createReply (threadId: ID!, content: String!) : Reply! @auth
    markAsFavorite (id: ID!) : Favorite! @auth
    unmarkAsFavorite (id: ID!) : Boolean! @auth
    markAsBestAnswer (id: ID!) : Reply! @auth
    unmarkAsBestAnswer (id: ID!) : Reply! @auth
    updateReply (id: ID!, content: String!) : Reply! @auth
    deleteReply (id: ID!) : Boolean! @auth
  }

  extend type Subscription {
    replyAdded: Reply!
    replyFavorited: Favorite!
    replyUnfavorited: Favorite!
    replyMarkedAsBestAnswer: Reply!
    replyUnmarkedAsBestAnswer: Reply!
  }
`;