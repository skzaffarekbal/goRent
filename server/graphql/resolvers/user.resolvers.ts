import { Response } from 'express';
import {
  forgetPassword,
  login,
  registerUser,
  updatePassword,
  updateUserProfile,
  uploadUserAvatar,
} from '../../controllers/user.controller';
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
    registerUser: (_: any, { userInput }: { userInput: UserInput }, { res }: { res: Response }) =>
      registerUser(userInput, res),
    login: (
      _: any,
      { email, password }: { email: string; password: string },
      { res }: { res: Response },
    ) => login(email, password, res),
    updateUserProfile: (
      _: any,
      { userInput }: { userInput: Partial<UserInput> },
      { user }: { user: IUser },
    ) => updateUserProfile(userInput, user.id),
    updatePassword: (
      _: any,
      { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
      { user }: { user: IUser },
    ) => updatePassword(oldPassword, newPassword, user.id),
    uploadUserAvatar: (_: any, { avatar }: { avatar: string }, { user }: { user: IUser }) =>
      uploadUserAvatar(avatar, user.id),
    forgetPassword: (_: any, { email }: { email: string }) => forgetPassword(email),
  },
};
