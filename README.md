Forum API using GraphQL
==================================

This is an implementation of a Forum backend service delivered using a graphql interface

Getting Started
---------------

```sh
# clone the project
git clone git@github.com:einnor/graphql-forum-api.git
cd graphql-forum-api

# Install dependencies
yarn

# Configure environment variables
mv env.example .env # Then modify the values accordingly

# Run migrations
npx sequelize-cli db:migrate

# Run seeders
npx sequelize db:seed:all

# Run the server
yarn run dev

# Access GraphQLi
http://localhost:4000/graphql
```
