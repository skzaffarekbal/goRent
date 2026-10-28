import { IBooking, IUser } from '@gorent/shared';
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
  async (bookingId: string, bookingInput: Partial<BookingInput>, user: IUser) => {
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

export const getCarBookedDates = catchAsyncErrors(async (carId: string) => {
  const bookings = await Booking.find({
    car: carId,
  });

  const bookingDates = bookings.flatMap((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    const dates: Date[] = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }

    return dates;
  });

  return bookingDates;
});
