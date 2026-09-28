import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { GET_CAR_BY_ID } from '@/graphql/queries/car.queries';
import type { ICar } from '@gorent/shared';
import CarFeatures from '@/components/car/CarFeatures';

import { CarFaqs } from '@/components/car/CarFaqs';
// import { CarImagesSlider } from "./CarImageSlider";
// import { CustomBreadcrumb } from "../layout/BreadCrumbs";
// import { BookingForm } from "../booking/BookingForm";
// import CarReviews from "../review/CarReviews";

const CarDetails = () => {
  const params = useParams();
  const { data, loading, error } = useQuery<{ getCarById: ICar }>(GET_CAR_BY_ID, {
    variables: {
      carId: params?.id,
    },
  });

  console.log('Car details :', error);

  const car: ICar = data?.getCarById;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container'>
      <main className='my-8 grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-4'>
        <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3'>
          <Card className='overflow-hidden'>
            <CardHeader className='flex flex-row items-start bg-muted/25'>
              <div className='grid gap-0.5'>
                <CardTitle className='px-8 mb-5 text-xl'>
                  <Badge variant='outline' className='flex py-2 text-sm'>
                    <MapPin className='h-4 w-4 mr-2' />
                    <p>{car.address}</p>
                  </Badge>
                </CardTitle>
                <div className='text-sm text-muted-foreground'>
                  {/* <CarImagesSlider /> */}
                  <div className='px-8 mt-5'>
                    <h1 className='text-3xl font-bold'>{car.name}</h1>

                    <p className='font-bold text-lg pt-2'>
                      <span className='text-xl'>${car.rentPerDay}</span> / Day
                    </p>

                    <div className='flex items-center my-5'>
                      {/* Star Rating Component */}
                      <p className='ms-2 text-sm font-bold text-gray-900 dark:text-white'>
                        {car.ratings.value}
                      </p>
                      <span className='w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400'></span>
                      <p className='text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white'>
                        {car.ratings.count} reviews
                      </p>
                    </div>

                    <DropdownMenuSeparator />
                    <p className='text-lg'>{car.description}</p>
                    <DropdownMenuSeparator />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <CarFeatures car={car} />
          <CarFaqs />

          {/* <CarReviews /> */}
        </div>
        <div>{/* <BookingForm /> */}</div>
      </main>
    </div>
  );
};

export default CarDetails;
