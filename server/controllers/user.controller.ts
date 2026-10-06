import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import { UserInput } from '../types/user.types';
import User from '../models/user.model';

export const registerUser = catchAsyncErrors(async (userInput: UserInput) => {
  const { name, email, password, phone } = userInput;

  return await User.create({
    name,
    email,
    password,
    phone,
  });
});
