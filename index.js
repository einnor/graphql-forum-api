const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();
const port = 4000;

const typeDefs = gql`
  type Query {
    sayHello: String
  }
`;

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
});

server.applyMiddleware({
  app,
  cors: true,
});

app.listen((port) => console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`));
