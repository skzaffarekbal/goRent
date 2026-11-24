import { createUpdateReview } from '../../controllers/review.controller';
import { IUser } from '@gorent/shared';
import { ReviewInput } from '../../types/review.types';

export const reviewResolver = {
  Mutation: {
    createUpdateReview: async (
      _: any,
      { reviewInput }: { reviewInput: ReviewInput },
      { user }: { user: IUser },
    ) => createUpdateReview(reviewInput, user?.id),
  },
};
