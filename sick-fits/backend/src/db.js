const { Prisma } = require('prisma-binding');

// Connect to remote Prisma DB in order to query it with JS on the backend.
const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false
});

module.exports = db;