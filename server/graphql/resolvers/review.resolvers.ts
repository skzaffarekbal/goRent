import { canReview, createUpdateReview } from '../../controllers/review.controller';
import { IUser } from '@gorent/shared';
import { ReviewInput } from '../../types/review.types';

export const reviewResolver = {
  Query: {
    canReview: (
      _: any,
      { canReviewCarId }: { canReviewCarId: string },
      { user }: { user: IUser },
    ) => canReview(canReviewCarId, user?.id),
  },
  Mutation: {
    createUpdateReview: (
      _: any,
      { reviewInput }: { reviewInput: ReviewInput },
      { user }: { user: IUser },
    ) => createUpdateReview(reviewInput, user?.id),
  },
};
