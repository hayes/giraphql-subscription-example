import builder from '../builder';

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      subscribe: (subs) => {
        subs.register('hello-name');
      },
      resolve: (root, args, { db }) => db.helloName,
      smartSubscription: true,
    }),
  }),
});

builder.subscriptionType({
  fields: (t) => ({}),
});

builder.mutationType({
  fields: (t) => ({
    sayHello: t.boolean({
      args: {
        name: t.arg.string({
          required: true,
        }),
      },
      resolve: async (root, args, { pubsub, db }) => {
        // eslint-disable-next-line no-param-reassign
        db.helloName = args.name;

        await pubsub.publish('hello-name', null);

        return true;
      },
    }),
  }),
});

const schema = builder.toSchema({});

export default schema;
