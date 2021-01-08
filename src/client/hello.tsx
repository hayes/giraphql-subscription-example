import React, { useState } from 'react';
import { useMutation, useSubscription } from '@apollo/client';
import { HelloSubscribeDocument, SayHiDocument } from './graphql';

const Hello = () => {
  const { loading, error, data } = useSubscription(HelloSubscribeDocument);
  const [sayHi, sayHiResult] = useMutation(SayHiDocument);
  const [name, setName] = useState('');

  if (error || sayHiResult.error) {
    return <pre style={{ color: 'red' }}>{error || sayHiResult.error}</pre>;
  }

  if (loading) {
    return <span>loading...</span>;
  }

  return (
    <div>
      <span>{`Hello, ${data?.hello || 'unknown'}!`}</span>
      <br />
      <label htmlFor="name">
        name:{' '}
        <input name="name" onInput={(ev) => void setName((ev.target as HTMLInputElement).value)} />
      </label>
      <button
        type="button"
        disabled={sayHiResult.loading}
        onClick={() =>
          sayHi({
            variables: {
              name,
            },
          })
        }
      >
        Say Hi!
      </button>
    </div>
  );
};

export default Hello;
