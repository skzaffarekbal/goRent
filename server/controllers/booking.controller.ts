import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import Booking from '../models/booking.model';

export const createBooking = catchAsyncErrors(async (bookingInput: any, userId: string) => {
  const newBooking = await Booking.create({ ...bookingInput, user: userId });
  return newBooking;
});
