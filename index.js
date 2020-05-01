const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const models = require('./models');
const typeDefs = require('./typeDefs');

const app = express();
const port = 4000;

const resolvers = {
  Query: {
    sayHello() {
      return 'Hello GraphQL!'
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models },
});

server.applyMiddleware({
  app,
  cors: true,
});

app.listen({ port }, () => console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`));
