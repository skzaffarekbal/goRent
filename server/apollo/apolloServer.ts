import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import { Application, json } from 'express';
import { carTypeDefs } from '../graphql/typeDefs/car.typeDefs';
import { carResolvers } from '../graphql/resolvers/car.resolvers';
import { userTypeDefs } from '../graphql/typeDefs/user.typeDefs';
import { userResolvers } from '../graphql/resolvers/user.resolvers';

export async function startApolloServer(app: Application) {
  const typeDefs = [carTypeDefs, userTypeDefs];
  const resolvers = [carResolvers, userResolvers];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const apolloServer = new ApolloServer({
    schema,
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors({
      credentials: true,
      origin: ['http://localhost:3000'],
    }),
    json(),
    expressMiddleware(apolloServer),
  );
}
