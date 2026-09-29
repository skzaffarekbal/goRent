import { CardHeader, CardTitle } from '@/components/ui/card';
import CardItem from '@/components/car/CardItem';
import { Link } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ICar } from '@gorent/shared';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

type Props = {
  cars: ICar[];
  loading: boolean;
};

const ListHomeCars = ({ cars, loading }: Props) => {
  if (loading) {
    return <LoadingSpinner fullScreen={true} size={60} />;
  }

  return (
    <>
      <CardHeader className='p-0'>
        <CardTitle className='group flex items-center text-2xl p-0'>
          Rent Car for Your Next Trip
        </CardTitle>
        <div className='flex'>
          <Link to='/search' className='inline-block'>
            <Button variant='ghost' className='px-1 '>
              <ArrowLeftRight className='h-4 w-4 me-1' />
              Search cars within location/budget/dates
            </Button>
          </Link>
        </div>
      </CardHeader>
      <div className='text-sm text-muted-foreground'>
        {cars?.map((car: ICar) => (
          <CardItem key={car.id} car={car} />
        ))}
      </div>
    </>
  );
};

export default ListHomeCars;
