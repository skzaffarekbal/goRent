import { IUser } from '@gorent/shared';
import { createBooking } from '../../controllers/booking.controller';
import { BookingInput } from '../../types/booking.types';

export const bookingResolvers = {
  Query: {},
  Mutation: {
    createBooking: (
      _: any,
      { bookingInput }: { bookingInput: BookingInput },
      { user }: { user: IUser },
    ) => createBooking(bookingInput, user.id),
  },
};
