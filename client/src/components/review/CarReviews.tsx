import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DropdownMenuSeparator } from '../ui/dropdown-menu';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ReviewDialog } from './ReviewDialog';
import type { IReview } from '@gorent/shared';
import { getUserNameInitials, parseTimestampDate } from '@/utils/helpers';
import { StarRating } from '../ui/star-rating';
import { useReactiveVar } from '@apollo/client/react';
import { userVar } from '@/apollo/apollo-vars';

type Props = {
  carId: string;
  reviews: IReview[];
  refetchCar: () => void;
};

const CarReviews = ({ carId, reviews, refetchCar }: Props) => {
  const user = useReactiveVar(userVar);
  const currentUserReview = reviews?.find((review) => review?.user?.id === user?.id);

  return (
    <div>
      <Card>
        <CardHeader className='bg-muted/25'>
          <div className='grid gap-0.5'>
            {currentUserReview ? (
              <>
                <CardTitle className='group flex items-center gap-2 mb-5 text-2xl'>
                  <p className='text-2xl font-bold'>Your Review</p>
                  <ReviewDialog
                    buttonText={'Update Your Review'}
                    carId={carId}
                    review={currentUserReview}
                    refetchCar={refetchCar}
                  />
                </CardTitle>
                <CardDescription>
                  <div className='px-2'>
                    <div className='flex my-5'>
                      <Avatar className='h-20 w-20'>
                        <AvatarImage src={currentUserReview?.user?.avatar?.url} />
                        <AvatarFallback>
                          {getUserNameInitials(currentUserReview?.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='ms-4'>
                        <h3 className='text-xl font-black'>{currentUserReview?.user?.name}</h3>
                        <p className='mb-3'>
                          Last Updated: {parseTimestampDate(currentUserReview?.updatedAt)}
                        </p>
                        {/* Star Rating Component */}
                        <StarRating
                          rating={currentUserReview?.rating}
                          starRatedColor='#f1a545'
                          emptyColor='#cccccc'
                          numberOfStars={5}
                          size={4}
                        />
                        <p className='mt-4 text-md font-semibold'>{currentUserReview?.comment}</p>
                      </div>
                    </div>
                  </div>
                </CardDescription>
              </>
            ) : (
              <CardTitle className='group flex items-center gap-2 mb-5 text-xl'>
                <Alert variant='destructive' className='flex justify-between items-center w-full'>
                  <div className='flex items-center gap-2'>
                    <AlertCircle className='h-4 w-4' />
                    <div>
                      <AlertTitle>You have not given any review</AlertTitle>
                      <AlertDescription>
                        You can give your review by clicking on the button below
                      </AlertDescription>
                    </div>
                  </div>
                  <ReviewDialog
                    buttonText={'Post Your Review'}
                    carId={carId}
                    refetchCar={refetchCar}
                  />
                </Alert>
              </CardTitle>
            )}
          </div>
        </CardHeader>
      </Card>

      {reviews?.length > 0 && (
        <Card className='mt-10'>
          <CardHeader className='bg-muted/25'>
            <div className='grid gap-0.5'>
              <CardTitle className='group flex items-center gap-2 mb-5 text-2xl'>
                <p className='text-2xl font-bold mt-5'>{reviews.length} Reviews</p>
              </CardTitle>
              <div className='text-sm text-muted-foreground'>
                <div className='px-8'>
                  {reviews.map((review) => {
                    return (
                      <div key={review.id}>
                        <DropdownMenuSeparator />
                        <div className='flex my-5'>
                          <Avatar className='h-20 w-20'>
                            <AvatarImage src={review.user?.avatar?.url} />
                            <AvatarFallback>
                              {getUserNameInitials(review.user?.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className='ms-4'>
                            <h3 className='text-xl font-black'>{review.user?.name}</h3>
                            <p className='mb-3'>
                              Last Updated: {parseTimestampDate(review.updatedAt)}
                            </p>
                            {/* Star Ratings Component */}
                            <StarRating
                              rating={review?.rating}
                              starRatedColor='#f1a545'
                              emptyColor='#cccccc'
                              numberOfStars={5}
                              size={4}
                            />
                            <p className='mt-4 text-md font-semibold'>{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default CarReviews;
