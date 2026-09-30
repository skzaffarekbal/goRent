import { Card, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { updateSearchParams } from '@/utils/helpers';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Filters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newSearchParams = updateSearchParams(searchParams, 'query', searchQuery);
    const path = `${window.location.pathname}?${newSearchParams.toString()}`;
    navigate(path);
  };

  const carCategories = ['Sedan', 'SUV', 'Coupe', 'Convertible'];
  const carBrands = ['Toyota', 'Honda', 'Ford', 'Chevrolet'];
  const carTransmissions = ['Automatic', 'Manual'];
  return (
    <div>
      <Card>
        <CardHeader className='flex flex-row items-start bg-muted/25'>
          <div className='grid gap-0.5'>
            <div className='text-sm text-muted-foreground'>
              <div className='filter-section my-8'>
                <form onSubmit={handleSubmit}>
                  <h2 className='text-xl font-bold mt-4 my-2'>Type keyword</h2>
                  <div className='relative ml-auto flex-1 md:grow-0'>
                    <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input
                      type='search'
                      placeholder='Search...'
                      className='w-full rounded-lg bg-background pl-8'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>

              <div className='filter-section my-8'>
                <h2 className='text-xl font-bold mt-4 my-3'>Car Type</h2>
                {carCategories?.map((category) => (
                  <div key={category} className='flex items-center space-x-2 my-2'>
                    <Checkbox id='category' name='category' value={category} />
                    <label
                      htmlFor='carType'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>

              <div className='filter-section my-8'>
                <h2 className='text-xl font-bold mt-4 my-3'>Select Brand</h2>
                {carBrands?.map((brand) => (
                  <div key={brand} className='flex items-center space-x-2 my-2'>
                    <Checkbox id='brand' name='brand' value={brand} />
                    <label
                      htmlFor='carBrand'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>

              <div className='filter-section my-8'>
                <h2 className='text-xl font-bold mt-4 my-3'>Transmission</h2>
                {carTransmissions?.map((transmission) => (
                  <div key={transmission} className='flex items-center space-x-2 my-2'>
                    <Checkbox id='transmission' name='transmission' value={transmission} />
                    <label
                      htmlFor='carTransmission'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {transmission}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Filters;
