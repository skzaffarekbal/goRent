import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
  credentials: 'include',
});

const cache = new InMemoryCache({});

const client = new ApolloClient({
  link: httpLink,
  cache,
});

export default client;
