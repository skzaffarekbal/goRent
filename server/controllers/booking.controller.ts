import { IUser } from '@gorent/shared';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import Booking from '../models/booking.model';
import { BookingInput } from '../types/booking.types';

export const createBooking = catchAsyncErrors(async (bookingInput: any, userId: string) => {
  const newBooking = await Booking.create({ ...bookingInput, user: userId });
  return newBooking;
});

export const getBookingById = catchAsyncErrors(async (bookingId: string, user: IUser) => {
  const booking = await Booking.findById(bookingId).populate('car');

  if (!booking) {
    throw new Error('Booking not found');
  }

  // throw error if user is not the owner of the booking and not an admin
  if (!user.role?.includes('admin') && booking.user.toString() !== user.id) {
    throw new Error('Unauthorized to access this booking');
  }

  return booking;
});

export const updateBooking = catchAsyncErrors(
  async (bookingId: string, bookingInput: BookingInput, user: IUser) => {
    const booking = await Booking.findById(bookingId).populate('car');

    if (!booking) {
      throw new Error('Booking not found');
    }

    // throw error if user is not the owner of the booking and not an admin
    if (!user.role?.includes('admin') && booking.user.toString() !== user.id) {
      throw new Error('Unauthorized to access this booking');
    }

    await booking.set(bookingInput).save();

    return true;
  },
);
