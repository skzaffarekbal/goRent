import { Response } from 'express';
import { login, registerUser } from '../../controllers/user.controller';
import { UserInput } from '../../types/user.types';

export const userResolvers = {
  Query: {
    me: (_: any) => {
      return 'Current User';
    },
  },
  Mutation: {
    registerUser: (_: any, { userInput }: { userInput: UserInput }, { res }: { res: Response }) => {
      return registerUser(userInput, res);
    },
    login: (
      _: any,
      { email, password }: { email: string; password: string },
      { res }: { res: Response },
    ) => {
      return login(email, password, res);
    },
  },
};
