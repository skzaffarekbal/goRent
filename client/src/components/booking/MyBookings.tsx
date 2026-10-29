import { CreditCard, DollarSign, ReceiptText, Search, Users, X } from 'lucide-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../ui/input';
import { useQuery } from '@apollo/client/react';
import { GET_MY_BOOKINGS } from '@/graphql/queries/booking.queries';
import { useState } from 'react';
import type { IBooking } from '@gorent/shared';
import {
  calculateTablePaginationEnd,
  calculateTablePaginationStart,
  errorToast,
  formatDate,
  parseTimestampDate,
} from '@/utils/helpers';
import LoadingSpinner from '../layout/LoadingSpinner';
import CustomPagination from '../layout/CustomPagination';

const MyBookings = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const page = Number(searchParams.get('page')) || 1;
  const [searchQuery, setSearchQuery] = useState(query || '');
  const navigate = useNavigate();

  const { error, data, loading } = useQuery<{
    myBookings: {
      bookings: IBooking[];
      totalBookings: number;
      totalUnpaidBookings: number;
      totalAmount: number;
      pagination: { resPerPage: number; totalCount: number };
    };
  }>(GET_MY_BOOKINGS, {
    variables: {
      query,
      page,
    },
  });

  if (error) {
    errorToast(error);
  }

  const bookings = data?.myBookings?.bookings || [];
  const pagination = data?.myBookings?.pagination as { resPerPage: number; totalCount: number };
  const totalAmount = data?.myBookings?.totalAmount || 0;
  const totalBookings = data?.myBookings?.totalBookings || 0;
  const totalUnpaidBookings = data?.myBookings?.totalUnpaidBookings || 0;

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/me/bookings?query=${searchQuery}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    navigate(`/me/bookings`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen={true} size={60} />;
  }

  return (
    <div>
      <div className='flex min-h-screen w-full flex-col bg-muted/40'>
        <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
          <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            <h1 className='text-3xl font-bold mt-5'>Your Bookings Stats</h1>
            <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Total Amount</CardTitle>
                  <DollarSign className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>${totalAmount?.toFixed(2)}</div>
                  <p className='text-xs text-muted-foreground'>
                    Total Amount you spent on Bookings
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Bookings</CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{totalBookings}</div>
                  <p className='text-xs text-muted-foreground'>
                    Total No of Cars you booked for rental
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Unpaid Bookings</CardTitle>
                  <CreditCard className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{totalUnpaidBookings}</div>
                  <p className='text-xs text-muted-foreground'>
                    No of Bookings, you have not paid for
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className='flex flex-col md:flex-row mb-4'>
                <div className='flex-1'>
                  <CardTitle>Bookings</CardTitle>
                  <CardDescription>View your booking details</CardDescription>
                </div>
                <form onSubmit={submitHandler}>
                  <div className='relative ml-auto flex-1 md:grow-0'>
                    <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input
                      type='search'
                      placeholder='Search by Booking ID'
                      className='w-full rounded-lg bg-background pl-8 md:w-50 lg:w-84'
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    />
                    {searchQuery ? (
                      <X
                        className='absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground'
                        onClick={clearSearch}
                      />
                    ) : null}
                  </div>
                </form>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='hidden w-25 sm:table-cell'>Image</TableHead>
                      <TableHead>Car</TableHead>
                      <TableHead>Booking ID</TableHead>
                      <TableHead className='hidden md:table-cell'>Payment Status</TableHead>
                      <TableHead className='hidden md:table-cell'>Total Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings?.map((booking: IBooking) => (
                      <TableRow key={booking.id}>
                        <TableCell className='hidden sm:table-cell'>
                          <Link to={`/car/${booking.car.id}`}>
                            {booking.car.images.length > 0 ? (
                              <img
                                src={booking.car.images[0].url}
                                alt={booking.car.name}
                                className='aspect-square rounded object-cover'
                                height={100}
                                width={100}
                              />
                            ) : (
                              <img
                                src='/go-rent-car-logo.svg'
                                className='aspect-square rounded object-cover'
                                height={100}
                                width={100}
                              />
                            )}
                          </Link>
                        </TableCell>
                        <TableCell className='font-medium'>
                          <Link to={`/car/${booking.car.id}`}>{booking.car.name}</Link>
                          <span className='text-sm font-thin text-muted-foreground block'>
                            {formatDate(booking?.startDate, 'MMM dd, yyyy')} to{' '}
                            {formatDate(booking?.endDate, 'MMM dd, yyyy')}
                          </span>
                        </TableCell>
                        <TableCell className='font-medium'>
                          #{booking.id}
                          <span className='text-sm font-thin text-muted-foreground block'>
                            {parseTimestampDate(booking?.createdAt.toString())}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{booking.paymentInfo.status}</Badge>
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          ${booking?.amount?.total?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {booking?.paymentInfo?.status == 'pending' && (
                            <Link to={`/booking/${booking.id}/payment_method`}>
                              <Button>
                                <CreditCard className='mr-2 h-4 w-4' /> Pay
                              </Button>
                            </Link>
                          )}
                          {booking?.paymentInfo?.status == 'paid' && (
                            <Link to='/invoice'>
                              <Button className='ml-2'>
                                <ReceiptText className='mr-2 h-4 w-4' /> Invoice
                              </Button>
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              {pagination?.totalCount > 0 && (
                <CardFooter>
                  <div className='text-xs text-muted-foreground'>
                    Showing {calculateTablePaginationStart(page, pagination?.resPerPage)}-
                    {calculateTablePaginationEnd(
                      page,
                      pagination?.resPerPage,
                      pagination?.totalCount,
                    )}{' '}
                    of <strong>{pagination?.totalCount}</strong> bookings
                  </div>
                </CardFooter>
              )}
            </Card>
          </main>
        </div>
        <CustomPagination totalCount={pagination?.totalCount} resPerPage={pagination?.resPerPage} />
      </div>
    </div>
  );
};

export default MyBookings;
