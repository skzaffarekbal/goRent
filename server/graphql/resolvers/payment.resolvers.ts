import { stripeCheckoutSession } from '../../controllers/payment.controller';

export const paymentResolvers = {
  Mutation: {
    stripeCheckoutSession: (_: any, { bookingId }: { bookingId: string }) =>
      stripeCheckoutSession(bookingId),
  },
};
