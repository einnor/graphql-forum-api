const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');

const models = require('./models');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { getAuthUser } = require('./utils');

const app = express();
const port = 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context: { models },
  context: ({ req }) => {
    const authUser = getAuthUser(req);

    return { models, authUser };
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
