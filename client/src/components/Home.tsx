import Filters from '@/components/layout/Filters';
import ListHomeCars from '@/components/car/ListHomeCars';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_CARS } from '@/graphql/queries/car.queries';
import type { ICar } from '@gorent/shared';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const transmission = searchParams.get('transmission');
  const fuelType = searchParams.get('fuelType');

  const page = Number(searchParams.get('page')) || 1;

  const filters = {
    status: 'Active',
    ...(category && { category }),
    ...(brand && { brand }),
    ...(transmission && { transmission }),
    ...(fuelType && { fuelType }),
  };

  const variables = {
    query,
    filters,
    page,
  };

  const { loading, error, data } = useQuery<{
    getAllCars: { cars: ICar[]; pagination: { resPerPage: number; totalCount: number } };
  }>(GET_ALL_CARS, {
    variables,
  });

  console.log('Error :', error);

  return (
    <main className='my-8 grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-10'>
      <div className='md:col-span-2 lg:col-span-2 flex flex-col'>
        <Filters />
      </div>
      <div className='grid auto-rows-max items-start gap-4 md:gap-8 md:col-span-4 lg:col-span-4 flex flex-col'>
        <ListHomeCars
          cars={data?.getAllCars?.cars}
          loading={loading}
          pagination={data?.getAllCars?.pagination}
        />
      </div>
      <div className='md:col-span-6 lg:col-span-4 flex flex-col'>
        <div className='flex items-center justify-center h-screen'></div>
        {/* Google Map Component */}
      </div>
    </main>
  );
};

export default Home;
