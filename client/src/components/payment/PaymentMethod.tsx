import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Coins, CreditCard, ReceiptText } from 'lucide-react';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { AlertMessage } from '../layout/AlertMessage';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { GET_BOOKING_BY_ID } from '@/graphql/queries/booking.queries';
import LoadingSpinner from '../layout/LoadingSpinner';
import { errorToast, errorWrapper, formatDate } from '@/utils/helpers';
import type { IBooking } from '@gorent/shared';
import { useState } from 'react';
import NotFound from '../layout/NotFound';
import { UPDATE_BOOKING_MUTATION } from '@/graphql/mutations/booking.mutation';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CarImagesSlider } from '../car/CarImagesSlider';
import { STRIPE_CHECKOUT_SESSION_MUTATION } from '@/graphql/mutations/payment.mutation';

const PaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { id: bookingId } = useParams<{ id: string }>();
  // const navigate = useNavigate();

  const {
    data,
    loading: bookingLoading,
    error: bookingError,
  } = useQuery<{ getBookingById: IBooking }>(GET_BOOKING_BY_ID, {
    variables: { bookingId: bookingId },
  });

  const booking = data?.getBookingById;

  const [updateBooking] = useMutation(UPDATE_BOOKING_MUTATION, {
    onCompleted: () => {
      toast.success('Booking updated successfully', {
        description: 'Please pay cash with in 6 hours. Otherwise your booking will be removed.',
      });
    },
    onError: (error) => {
      errorToast(error);
    },
  });

  const [stripeCheckoutSession, { loading: checkoutLoading }] = useMutation(
    STRIPE_CHECKOUT_SESSION_MUTATION,
    {
      onCompleted: (data: { stripeCheckoutSession: { url: string } }) => {
        if (data.stripeCheckoutSession?.url) {
          // navigate(data.stripeCheckoutSession.url);
          window.location.href = data.stripeCheckoutSession.url;
        }
      },
      onError: (error) => {
        errorToast(error);
      },
    },
  );

  const handleBookingUpdate = async () => {
    if (paymentMethod === 'cash') {
      const bookingInput = {
        paymentInfo: { method: 'cash' },
      };
      await errorWrapper(async () => {
        await updateBooking({ variables: { bookingId, bookingInput } });
      });
    }

    if (paymentMethod === 'card') {
      await errorWrapper(async () => {
        await stripeCheckoutSession({ variables: { bookingId } });
      });
    }
  };

  if (bookingLoading) {
    return <LoadingSpinner fullScreen={true} size={60} />;
  }

  if (bookingError) {
    errorToast(bookingError);
    return <NotFound />;
  }

  return (
    <div className='flex flex-col justify-center items-center my-10'>
      <div className='mb-10 flex flex-col gap-2 items-center'>
        <h1 className='lg:text-4xl md:text-2xl text-xl text-gray-600'>Booking #{booking?.id}</h1>
        <div className='w-full flex flex-col gap-2 items-center max-w-sm'>
          <h2 className='lg:text-xl md:text-lg text-base text-gray-600 font-semibold'>
            {booking?.car.name}
          </h2>
          <span className='text-sm text-gray-500'>
            {formatDate(booking?.startDate, 'MMM dd, yyyy')} to{' '}
            {formatDate(booking?.endDate, 'MMM dd, yyyy')}
          </span>
          <CarImagesSlider images={booking?.car.images} />
        </div>
      </div>
      <div className='flex md:flex-row flex-col gap-4 items-center md:items-stretch justify-center'>
        <Card className='w-full max-w-xl flex flex-col'>
          <div className='flex items-center justify-start'>
            <ReceiptText className='h-12 w-12 ms-5' />
            <CardHeader className='w-full ps-2'>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Below are your booking details</CardDescription>
            </CardHeader>
          </div>
          <CardContent className='flex-1'>
            <form>
              <div className='grid w-full items-center gap-3'>
                <div className='flex justify-between'>
                  <p className='text-md'>Days of Rent:</p>
                  <p className='font-bold'>{booking?.daysOfRent}</p>
                </div>

                <div className='flex justify-between'>
                  <p className='text-md'>Rent Per Day:</p>
                  <p className='font-bold'>{booking?.rentPerDay}</p>
                </div>

                <div className='flex justify-between'>
                  <p className='text-md'>Total Rent:</p>
                  <p className='font-bold'>${booking?.amount?.rent?.toFixed(2)}</p>
                </div>

                <div className='flex justify-between'>
                  <p className='text-md'>Discount:</p>
                  <p className='font-bold'>${booking?.amount?.discount?.toFixed(2)}</p>
                </div>

                <div className='flex justify-between'>
                  <p className='text-md'>Tax (15%):</p>
                  <p className='font-bold'>${booking?.amount?.tax?.toFixed(2)}</p>
                </div>
                <DropdownMenuSeparator />

                <div className='flex justify-between'>
                  <p className='text-md'>Grand Total:</p>
                  <p className='font-bold'>${booking?.amount?.total?.toFixed(2)}</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className='w-full max-w-xl flex flex-col justify-between'>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Select your payment method to complete this booking</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-6'>
            <RadioGroup defaultValue='card' className='grid grid-cols-2 gap-6'>
              <Label
                htmlFor='cash'
                className={`flex flex-col items-center justify-between rounded-md border-2 bg-popover p-4 cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${
                  paymentMethod === 'cash' ? 'border-primary' : 'border-muted'
                }`}
                onClick={() => setPaymentMethod('cash')}
              >
                <RadioGroupItem value='cash' id='cash' className='sr-only' />
                <Coins className='mb-3 h-6 w-6' />
                Cash
              </Label>
              <Label
                htmlFor='card'
                className={`flex flex-col items-center justify-between rounded-md border-2 bg-popover p-4 cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${
                  paymentMethod === 'card' ? 'border-primary' : 'border-muted'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <RadioGroupItem value='card' id='card' className='sr-only' />
                <CreditCard className='mb-3 h-6 w-6' />
                Card
              </Label>
            </RadioGroup>
            {paymentMethod === 'cash' && (
              <AlertMessage
                title='Pay Cash within 6 hours'
                description='Otherwise your booking will be removed.'
                success={false}
              />
            )}
            {paymentMethod === 'card' && (
              <AlertMessage
                title='Instant Confirmation'
                description='Booking will be confirmed after payment'
                success={true}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button
              className='w-full'
              onClick={handleBookingUpdate}
              disabled={checkoutLoading || bookingLoading}
            >
              {paymentMethod === 'cash' ? (
                <Coins className='mr-2 h-4 w-4' />
              ) : (
                <CreditCard className='mr-2 h-4 w-4' />
              )}{' '}
              {paymentMethod === 'cash' ? 'Confirm Booking' : 'Pay Now'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethod;
