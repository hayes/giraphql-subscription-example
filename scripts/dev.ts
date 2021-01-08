import http from 'http';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import chokidar from 'chokidar';
import express from 'express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
// @ts-expect-error
import webpackConfig from '../webpack.config';

const PORT = 3000;

const devApp = express();
const compiler = webpack({
  ...webpackConfig,
  devtool: 'inline-source-map',
  mode: 'development',
});

const server = http.createServer(devApp);

// Do "hot-reloading" of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
const watcher = chokidar.watch(['./src/server', './src/client/*.graphql']);
let apolloServer: ApolloServer | null = null;

function setupApp() {
  const oldServer =
    apolloServer &&
    ((apolloServer as unknown) as { subscriptionServer?: SubscriptionServer }).subscriptionServer;

  if (oldServer) {
    oldServer.close();
  }

  import('../src/server/app')
    .then((appModule) => {
      apolloServer = appModule.server;
      appModule.server.installSubscriptionHandlers(server);

      return null;
    })
    .catch(console.error);
}

import('./generate')
  .then(({ generateSchemaAndTypes }) => {
    console.log('generating schema and types');

    return generateSchemaAndTypes();
  })
  .catch(console.error);

devApp.use(webpackMiddleware(compiler));
devApp.use(hotMiddleware(compiler));

devApp.use((req, res, next) => {
  import('../src/server/app')
    .then(
      ({ default: newApp }) => void newApp(req, res, next),
      (error) => void next(error), // eslint-disable-line promise/no-callback-in-promise
    )
    .catch(console.error);
});

watcher.on('ready', () => {
  watcher.on('all', () => {
    path.resolve(__dirname, '../src/server');
    console.log('Clearing /src/server/ module cache from server');

    Object.keys(require.cache).forEach((id) => {
      if (id.startsWith(path.resolve(__dirname, '../src/server')) || id.startsWith(__dirname)) {
        delete require.cache[id];
      }
    });

    setupApp();

    console.log('re-generating schema and types');
    import('./generate').then((gen) => gen.generateSchemaAndTypes()).catch(console.error);
  });
});

server.listen(PORT, () => {
  const address = server.address();

  if (!address || typeof address === 'string') {
    throw new Error(`Unexpected address ${address}`);
  }

  setupApp();

  console.log(`Server started: http://127.0.0.1:${address.port}/`);
});
