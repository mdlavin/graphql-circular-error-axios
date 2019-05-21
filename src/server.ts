import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { AddressInfo } from 'net';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import { Server } from 'http';
import Axios from 'axios';

const typeDefs = gql`
  type Query {
    fail(port: Int): String
  }
`;

const resolvers = {
  Query: {
    fail: async (_: never, { port }: { port: number }) => {
      // Make a request to the local server that will fail
      await Axios({
        url: `https://localhost:${port}`
      });
    }
  }
};

async function runServer(): Promise<Server> {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  server.applyMiddleware({ app, path: '/graphql' });

  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      resolve(server);
    });
  });
}

async function runQuery(port: number) {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: `http://localhost:${port}/graphql`,
      fetch
    }),
    cache: new InMemoryCache()
  });

  await client.query({
    query: gql(`{fail(port: ${port})}`)
  });
}

async function runTest() {
  const server = await runServer();
  try {
    const port = (server.address() as AddressInfo).port;
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
    try {
      await runQuery(port);
    } catch (e) {
      if (e.networkError) {
        console.error('A network error occurred while executing the query');
        console.error('The error was:');
        console.error(JSON.stringify(e.networkError.result.errors[0], null, 2));
        process.exitCode = 1;
      } else {
        throw e;
      }
    }
  } finally {
    server.close();
  }
}

runTest().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
