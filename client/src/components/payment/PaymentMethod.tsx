import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Coins, CreditCard, ReceiptText } from 'lucide-react';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { AlertMessage } from '../layout/AlertMessage';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKING_BY_ID } from '@/graphql/queries/booking.queries';
import LoadingSpinner from '../layout/LoadingSpinner';
import { errorToast } from '@/utils/helpers';
import type { IBooking } from '@gorent/shared';
import { useState } from 'react';
import NotFound from '../layout/NotFound';

const PaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { id: bookingId } = useParams<{ id: string }>();

  const {
    data,
    loading: bookingLoading,
    error: bookingError,
  } = useQuery<{ getBookingById: IBooking }>(GET_BOOKING_BY_ID, {
    variables: { bookingId: bookingId },
  });

  const booking = data?.getBookingById;

  if (bookingLoading) {
    return <LoadingSpinner fullScreen={true} size={60} />;
  }

  if (bookingError) {
    errorToast(bookingError);
    return <NotFound />;
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='mb-10 flex items-center'>
        <h1 className='text-4xl text-gray-600'>Booking #{booking?.id}</h1>
      </div>
      <div className='flex items-center'>
        <Card className='h-full w-full max-w-xl me-10'>
          <div className='flex items-center justify-start'>
            <ReceiptText className='h-12 w-12 ms-5' />
            <CardHeader className='w-full ps-2'>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Below are your booking details</CardDescription>
            </CardHeader>
          </div>
          <CardContent>
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
        <Card className='h-full w-full max-w-xl'>
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
                title='Pay Cash within 24 hours'
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
            <Button className='w-full'>
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
