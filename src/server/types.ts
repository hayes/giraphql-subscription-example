import { PubSub } from 'graphql-subscriptions';

export interface DB {
  helloName: string;
}

export interface ContextType {
  pubsub: PubSub;
  db: DB;
}
