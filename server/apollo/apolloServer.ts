import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Application, json } from 'express';
import { carTypeDefs } from '../graphql/typeDefs/car.typeDefs';
import { carResolvers } from '../graphql/resolvers/car.resolvers';

export async function startApolloServer(app: Application) {
  const typeDefs = [carTypeDefs];
  const resolvers = [carResolvers];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const apolloServer = new ApolloServer({
    schema,
  });

  await apolloServer.start();

  app.use('/graphql', json(), expressMiddleware(apolloServer));
}
