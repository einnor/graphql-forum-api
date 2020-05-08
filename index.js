const express = require('express');
const { ApolloServer, PubSub } = require('apollo-server-express');
const http = require('http');

const models = require('./models');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { getAuthUser } = require('./utils');
const { AuthDirective, IsAdminDirective } = require('./directives');
const { userLoader, channelLoader } = require('./loaders');

const app = express();
const port = 4000;

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthDirective,
    isAdmin: IsAdminDirective,
  },
  // context: { models },
  context: async ({ req, connection }) => {
    if (connection) {
      return { models, pubsub };
    } else {
      const authUser = getAuthUser(req);
      return {
        models,
        authUser,
        pubsub,
        loaders: {
          user: userLoader(),
          channel: channelLoader(),
        },
      };
    }
  }
});

server.applyMiddleware({
  app,
  cors: true,
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port }, () => {
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`)
});
