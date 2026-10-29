import { IUser } from '@gorent/shared';
import {
  createBooking,
  getBookingById,
  getCarBookedDates,
  myBookings,
  updateBooking,
} from '../../controllers/booking.controller';
import { BookingInput } from '../../types/booking.types';

export const bookingResolvers = {
  Query: {
    getBookingById: (_: any, { bookingId }: { bookingId: string }, { user }: { user: IUser }) =>
      getBookingById(bookingId, user),
    getCarBookedDates: (_: any, { carId }: { carId: string }) => getCarBookedDates(carId),
    myBookings: (
      _: any,
      { page, query }: { page: number; query: string },
      { user }: { user: IUser },
    ) => {
      const filters = { user: user.id };
      return myBookings(page, filters, query);
    },
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
