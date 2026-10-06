import { registerUser } from '../../controllers/user.controller';
import { UserInput } from '../../types/user.types';

export const userResolvers = {
  Query: {
    me: (_: any) => {
      return 'Current User';
    },
  },
  Mutation: {
    registerUser: (_: any, { userInput }: { userInput: UserInput }) => {
      return registerUser(userInput);
    },
  },
};
