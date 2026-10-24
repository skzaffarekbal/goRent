import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import { UserInput } from '../types/user.types';
import User from '../models/user.model';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { deleteImageFromCloudinary, uploadImageToCloudinary } from '../utils/cloudinary';

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

export const updateUserProfile = catchAsyncErrors(
  async (userData: Partial<UserInput>, userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user?.set(userData).save();

    return true;
  },
);

export const updatePassword = catchAsyncErrors(
  async (oldPassword: string, newPassword: string, userId: string) => {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordMatched = await bcrypt.compare(oldPassword, user?.password);

    if (!isPasswordMatched) {
      throw new Error('Old Password Is Incorrect');
    }

    user.password = newPassword;
    await user.save();

    return true;
  },
);

export const uploadUserAvatar = catchAsyncErrors(async (avatar: string, userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const avatarResponse = await uploadImageToCloudinary(avatar, 'goRent/avatars');

  if (user?.avatar?.public_id) {
    await deleteImageFromCloudinary(user?.avatar?.public_id);
  }

  user.avatar = {
    public_id: avatarResponse.publicId,
    url: avatarResponse.url,
  };
  await user.save();

  return true;
});
