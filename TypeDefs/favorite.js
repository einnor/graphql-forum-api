const { gql } = require('./node_modules/apollo-server-express');

module.exports = gql`
  type Favorite {
    user: User!
    reply: Reply!
  }
`;