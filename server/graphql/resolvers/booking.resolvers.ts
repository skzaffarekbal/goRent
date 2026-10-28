import { IUser } from '@gorent/shared';
import {
  createBooking,
  getBookingById,
  getCarBookedDates,
  updateBooking,
} from '../../controllers/booking.controller';
import { BookingInput } from '../../types/booking.types';

export const bookingResolvers = {
  Query: {
    getBookingById: (_: any, { bookingId }: { bookingId: string }, { user }: { user: IUser }) =>
      getBookingById(bookingId, user),
    getCarBookedDates: (_: any, { carId }: { carId: string }) => getCarBookedDates(carId),
  },
  Mutation: {
    createBooking: (
      _: any,
      { bookingInput }: { bookingInput: BookingInput },
      { user }: { user: IUser },
    ) => createBooking(bookingInput, user.id),
    updateBooking: (
      _: any,
      { bookingId, bookingInput }: { bookingId: string; bookingInput: Partial<BookingInput> },
      { user }: { user: IUser },
    ) => updateBooking(bookingId, bookingInput, user),
  },
};
