import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useState } from 'react';
import { errorWrapper } from '@/utils/helpers';
import { useMutation } from '@apollo/client/react';
import { CREATE_UPDATE_REVIEW_MUTATION } from '@/graphql/mutations/review.mutation';
import { toast } from 'sonner';
import LoadingSpinner from '../layout/LoadingSpinner';
import { StarRating } from '../ui/star-rating';
import type { IReview } from '@gorent/shared';

type Props = {
  buttonText: string;
  carId: string;
  review?: IReview;
  refetchCar: () => void;
};

export function ReviewDialog({ buttonText, carId, review, refetchCar }: Props) {
  const [rating, setRating] = useState<number>(review?.rating || 0);
  const [comment, setComment] = useState<string>(review?.comment || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [createUpdateReview, { loading }] = useMutation(CREATE_UPDATE_REVIEW_MUTATION, {
    onCompleted: () => {
      toast.success('Review Posted Successfully.');
      setIsDialogOpen(false);
      refetchCar();
    },
  });

  const submitHandler = async () => {
    const reviewInput = {
      rating,
      comment,
      car: carId,
    };

    await errorWrapper(async () => {
      await createUpdateReview({ variables: { reviewInput } });
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle>{buttonText}</DialogTitle>
          <DialogDescription>Post or update your review for this car</DialogDescription>
        </DialogHeader>
        <div className='grid gap-7 py-4'>
          <div className='grid w-full gap-3'>
            <Label htmlFor='message'>Your Ratings</Label>
            <StarRating
              rating={rating}
              starRatedColor='#f1a545'
              emptyColor='#cccccc'
              numberOfStars={5}
              size={8}
              onChange={(newRating: number) => setRating(newRating)}
            />
          </div>
          <div className='grid w-full gap-2'>
            <Label htmlFor='comments'>Your comments</Label>
            <Textarea
              placeholder='Type your review here.'
              id='comments'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={submitHandler}>
            {loading ? <LoadingSpinner /> : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
