import SchemaBuilder from '@giraphql/core';
import { subscribeOptionsFromIterator } from '@giraphql/plugin-smart-subscriptions';
import { ContextType } from './types';

const builder = new SchemaBuilder<{
  Context: ContextType;
}>({
  plugins: ['GiraphQLSmartSubscriptions'],
  smartSubscriptions: {
    ...subscribeOptionsFromIterator((name, { pubsub }) => pubsub.asyncIterator(name)),
  },
});

export default builder;
