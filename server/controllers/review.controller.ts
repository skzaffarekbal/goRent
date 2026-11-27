import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import { ReviewInput } from '../types/review.types';
import Review from '../models/review.model';
import Car from '../models/car.model';
import { IReview } from '@gorent/shared';
import Booking from '../models/booking.model';

export const createUpdateReview = catchAsyncErrors(
  async (reviewInput: ReviewInput, userId: string) => {
    const isReviewed = await Review.findOne({ user: userId, car: reviewInput.car });

    let review = null;
    if (isReviewed) {
      review = await Review.findByIdAndUpdate(isReviewed?.id, reviewInput, { new: true });
    } else {
      review = await Review.create({ user: userId, ...reviewInput });

      await Car.findByIdAndUpdate(reviewInput.car, {
        $push: { reviews: review?._id },
      });
    }

    return review;
  },
);

export const canReview = catchAsyncErrors(async (canReviewCarId: string, userId: string) => {
  const booking = await Booking.findOne({
    user: userId,
    car: canReviewCarId,
    'paymentInfo.status': 'paid',
  });

  return !!booking;
});
