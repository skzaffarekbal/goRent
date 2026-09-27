// import Filters from "./layout/Filters";
import ListHomeCars from '@/components/car/ListHomeCars';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_CARS } from '@/graphql/queries/car.queries';
import type { ICar } from '@gorent/shared';

const Home = () => {
  const { loading, error, data } = useQuery<{ getAllCars: ICar[] }>(GET_ALL_CARS);

  console.log('Error :', error);

  return (
    <main className='my-8 grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-10'>
      <div className='md:col-span-2 lg:col-span-2 flex flex-col'>{/* <Filters /> */}</div>
      <div className='grid auto-rows-max items-start gap-4 md:gap-8 md:col-span-4 lg:col-span-4 flex flex-col'>
        <ListHomeCars cars={data?.getAllCars} loading={loading} />
      </div>
      <div className='md:col-span-6 lg:col-span-4 flex flex-col'>
        <div className='flex items-center justify-center h-screen'></div>
        {/* Google Map Component */}
      </div>
    </main>
  );
};

export default Home;
