const { GraphQLScalarType, Kind} = require('graphql');

module.exports = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime scalar type',
    parseValue () {},
    parseLiteral () {},
    serialize (value) {
      const date = new Date(value);
      return date.toISOString();
    },
  }),
};
