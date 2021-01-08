import { ApolloServer, PubSub } from 'apollo-server-express';
import express from 'express';
import schema from './schema';

const app = express();

export const pubsub = new PubSub();

const db = {
  helloName: 'world',
};

export const server = new ApolloServer({
  schema,
  context: () => ({
    pubsub,
    db,
  }),
  debug: true,
  tracing: true,
  subscriptions: {
    path: '/subscriptions',
  },
  playground: {
    subscriptionEndpoint: '/subscriptions',
  },
});

server.applyMiddleware({ app });

export default app;
