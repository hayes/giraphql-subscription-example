import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo';
import Hello from './hello';

const App = () => (
  <ApolloProvider client={client}>
    <Hello />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.querySelector('#app'));
