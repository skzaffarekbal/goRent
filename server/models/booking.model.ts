import mongoose, { PopulatedDoc, Types } from 'mongoose';
import { BookingPaymentMethods, BookingPaymentStatus } from '@gorent/shared';
import { IBooking, ICar, IUser } from '@gorent/shared';

export interface IBookingDocument extends Omit<IBooking, 'car' | 'user'> {
  car: PopulatedDoc<ICar, Types.ObjectId>;
  user: PopulatedDoc<IUser, Types.ObjectId>;
}

const bookingSchema = new mongoose.Schema<IBookingDocument>(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    amount: {
      rent: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      tax: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    daysOfRent: {
      type: Number,
      required: true,
    },
    rentPerDay: {
      type: Number,
      required: true,
    },
    paymentInfo: {
      id: String,
      status: {
        type: String,
        default: 'pending',
        enum: { values: BookingPaymentStatus, message: 'Invalid payment status' },
      },
      method: {
        type: String,
        enum: { values: BookingPaymentMethods, message: 'Invalid payment method' },
      },
    },
    additionalNote: {
      type: String,
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model<IBookingDocument>('Booking', bookingSchema);
export default Booking;
