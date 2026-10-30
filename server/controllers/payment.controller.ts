import Stripe from 'stripe';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import Booking from '../models/booking.model';
import { ICar } from '@gorent/shared';
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeCheckoutSession = catchAsyncErrors(async (bookingId: string) => {
  const booking = await Booking.findById(bookingId).populate<{ car: ICar }>('car');

  if (!booking) {
    throw new Error('Booking not found');
  }

  const session = await stripeClient.checkout.sessions.create({
    // payment_method_types: ['card'],
    success_url: `${process.env.FRONTEND_URL}/me/bookings`,
    cancel_url: `${process.env.FRONTEND_URL}/car/${booking.car.id}`,
    client_reference_id: bookingId,
    customer_email: booking?.customer?.email,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: booking.amount.total * 100,
          product_data: {
            name: booking?.car?.name,
            description: booking?.car?.description,
            images: [booking?.car?.images[0]?.url],
          },
        },
        quantity: 1,
      },
    ],
  });

  return { url: session?.url };
});
