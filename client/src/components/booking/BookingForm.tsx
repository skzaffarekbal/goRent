import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { DropdownMenuSeparator } from '../ui/dropdown-menu';
import { MoveRight } from 'lucide-react';
// import CouponCard from '../coupon/CouponCard';
import { AlertMessage } from '../layout/AlertMessage';
import { useNavigate } from 'react-router-dom';
import { useMutation, useReactiveVar } from '@apollo/client/react';
import { userVar } from '@/apollo/apollo-vars';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { CarDatePicker } from './CarDatePicker';
import { differenceInDays } from 'date-fns';
import {
  adjustDateToLocalTimeZone,
  calculateAmount,
  errorToast,
  errorWrapper,
  formatDate,
  getAllDatesBetween,
} from '@/utils/helpers';
import { CREATE_BOOKING_MUTATION } from '@/graphql/mutations/booking.mutation';
import type { IBooking } from '@gorent/shared';

interface Props {
  carId: string;
  rentPerDay?: number;
  disableDates?: string[];
}

export function BookingForm({ carId, rentPerDay = 0, disableDates }: Props) {
  const user = useReactiveVar(userVar);
  const navigate = useNavigate();

  const [daysOfRent, setDaysOfRent] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [additionalNote, setAdditionalNote] = useState<string>('');
  const [customer, setCustomer] = useState<{ name: string; email: string; phone: string }>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [amount, setAmount] = useState<{
    rent: number;
    discount: number;
    tax: number;
    total: number;
  }>({
    rent: 0,
    discount: 0,
    tax: 0,
    total: 0,
  });

  const [dates, setDates] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [createBooking, { loading }] = useMutation<{ createBooking: IBooking }>(
    CREATE_BOOKING_MUTATION,
  );

  const bookedDates = disableDates?.map(formatDate);

  const dateChangeHandler = (date: DateRange | undefined) => {
    if (!date || !date.from || !date.to) return;

    const allDates = getAllDatesBetween(date.from, date.to);

    const filteredDates = allDates.filter((d) => bookedDates?.includes(d));

    if (filteredDates.length > 0) {
      setIsAvailable(false);
    } else {
      setIsAvailable(true);
    }

    setDates(date);
    const daysOfRent =
      differenceInDays(date.to?.setHours(0, 0, 0, 0), date.from?.setHours(0, 0, 0, 0)) + 1;
    setDaysOfRent(daysOfRent);
    setAmount(calculateAmount(rentPerDay, daysOfRent));
  };

  const newBookingHandler = async () => {
    if (!dates || !dates?.from || !dates?.to) return;

    if (daysOfRent <= 0) {
      return errorToast({ message: 'Please select booking dates' });
    }

    const newBookingData = {
      amount,
      customer,
      daysOfRent,
      rentPerDay,
      car: carId,
      startDate: adjustDateToLocalTimeZone(dates?.from),
      endDate: adjustDateToLocalTimeZone(dates?.to),
      additionalNote,
    };

    await errorWrapper(async () => {
      const { data } = await createBooking({ variables: { bookingInput: newBookingData } });
      if (data?.createBooking.id) {
        navigate(`/booking/${data.createBooking.id}/payment_method`);
      }
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>New Booking</CardTitle>
          <CardDescription>Enter the details to rent this car.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className='grid w-full items-center gap-6'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  placeholder='Full Name'
                  value={customer?.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
              </div>

              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Email Address'
                  value={customer?.email}
                  disabled
                />
              </div>

              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='phone'>Phone</Label>
                <Input
                  id='phone'
                  type='text'
                  placeholder='Phone No'
                  value={customer?.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
              </div>

              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='phoneno'>Booking Dates</Label>
                <CarDatePicker
                  dates={dates}
                  onDateChange={dateChangeHandler}
                  disableDates={disableDates}
                />
              </div>

              {isAvailable === false && (
                <AlertMessage
                  title='Not Available'
                  description='Dates are not available for booking. Try again!'
                  success={false}
                />
              )}

              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='additionalNote'>Additional Notes</Label>
                <Textarea
                  id='additionalNote'
                  placeholder='Type your additional notes here.'
                  value={additionalNote}
                  onChange={(e) => setAdditionalNote(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* <CouponCard /> */}

      <Card className='mt-5'>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Take a look at your booking & confirm</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className='grid w-full items-center gap-3'>
              <div className='flex justify-between'>
                <p className='text-md'>Days of Rent:</p>
                <p className='font-bold'>{daysOfRent}</p>
              </div>

              <div className='flex justify-between'>
                <p className='text-md'>Rent Per Day:</p>
                <p className='font-bold'>${rentPerDay}</p>
              </div>

              <div className='flex justify-between'>
                <p className='text-md'>Total Rent:</p>
                <p className='font-bold'>${amount?.rent?.toFixed(2)}</p>
              </div>

              <div className='flex justify-between'>
                <p className='text-md'>Tax (15%):</p>
                <p className='font-bold'>${amount?.tax?.toFixed(2)}</p>
              </div>
              <DropdownMenuSeparator />

              <div className='flex justify-between'>
                <p className='text-md'>Est. Total:</p>
                <p className='font-bold'>${amount?.total?.toFixed(2)}</p>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          {user && isAvailable && (
            <Button className='w-full' disabled={loading} onClick={newBookingHandler}>
              {loading ? 'Proceeding...' : 'Proceed'}
              <MoveRight className='ms-3 h-5 w-5' />
            </Button>
          )}

          {!user && (
            <AlertMessage
              title='Login!'
              description='Please login to rent this Car'
              success={false}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
