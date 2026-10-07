import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import { UserInput } from '../types/user.types';
import User from '../models/user.model';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const registerUser = catchAsyncErrors(async (userInput: UserInput, res: Response) => {
  const { name, email, password, phone } = userInput;

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  const token = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES as any,
  });

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: Number(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000,
  });

  return user;
});

export const login = catchAsyncErrors(async (email: string, password: string, res: Response) => {
  if (!email || !password) {
    throw new Error('Please enter your email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid Credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user?.password);

  if (!isPasswordValid) {
    throw new Error('Invalid Credentials');
  }

  const token = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES as any,
  });

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: Number(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000,
  });

  return user;
});
