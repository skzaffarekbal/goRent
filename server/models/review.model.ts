import mongoose, { PopulatedDoc, Types } from 'mongoose';
import { ICar, IReview, IUser } from '@gorent/shared';

interface IReviewDocument extends Omit<IReview, 'car' | 'user' | 'createdAt' | 'updatedAt'> {
  user: PopulatedDoc<IUser, Types.ObjectId>;
  car: PopulatedDoc<ICar, Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.model<IReviewDocument>('Review', reviewSchema);
export default Review;
