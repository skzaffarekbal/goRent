import { IUser, UserRoles } from '@gorent/shared';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Please enter your phone number'],
    },
    role: {
      type: [String],
      default: 'user',
      enum: { values: UserRoles, message: 'Please select correct role for user' },
    },
    avatar: {
      public_id: String,
      url: String,
    },
    resetPasswordToken: {
      type: String,
      default: undefined,
    },
    resetPasswordExpire: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
