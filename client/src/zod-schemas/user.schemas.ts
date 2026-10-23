import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(32, { message: 'Name must be at most 32 characters long' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .refine((val) => /^\d{10}$/.test(val), { message: 'Invalid phone number' }),
});

export const LoginUserSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is required' }),
});

export const UpdateProfileSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(32, { message: 'Name must be at most 32 characters long' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .refine((val) => /^\d{10}$/.test(val), { message: 'Invalid phone number' }),
});

export const UpdatePasswordSchema = z
  .object({
    oldPassword: z.string({ required_error: 'Old password is required' }),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(6, { message: 'New password must be at least 6 characters long' }),
    confirmPassword: z.string({ required_error: 'Confirm password is required' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
