import { IUser } from '@gorent/shared';
import { createBooking, getBookingById } from '../../controllers/booking.controller';
import { BookingInput } from '../../types/booking.types';

export const bookingResolvers = {
  Query: {
    getBookingById: (_: any, { bookingId }: { bookingId: string }, { user }: { user: IUser }) =>
      getBookingById(bookingId, user),
  },
  Mutation: {
    createBooking: (
      _: any,
      { bookingInput }: { bookingInput: BookingInput },
      { user }: { user: IUser },
    ) => createBooking(bookingInput, user.id),
  },
};
