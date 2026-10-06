import { IUser, UserRoles } from '@gorent/shared';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

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
      minLength: [6, 'Password must be at least 6 characters long'],
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

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
