import { allow, rule, shield } from 'graphql-shield';

const isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, context, info) => {
  return context.user !== null && context.user !== undefined;
});

const isAdmin = rule({ cache: 'contextual' })(async (parent, args, context, info) => {
  return context.user.role.includes('admin');
});

export const permissions = shield({
  Query: {
    me: isAuthenticated,
  },
  Mutation: {},
});
