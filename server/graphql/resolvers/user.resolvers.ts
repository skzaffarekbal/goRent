import { Response } from 'express';
import { login, registerUser } from '../../controllers/user.controller';
import { UserInput } from '../../types/user.types';
import { IUser } from '@gorent/shared';

export const userResolvers = {
  Query: {
    me: (_: any, __: any, { user }: { user: IUser }) => {
      return user;
    },
    logout: (_: any, __: any, { res }: { res: Response }) => {
      res.cookie('token', null, { maxAge: 0 });
      return true;
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
