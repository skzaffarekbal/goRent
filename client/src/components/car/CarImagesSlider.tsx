import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Props {
  images: Array<{ public_id: string; url: string }>;
}

export function CarImagesSlider({ images }: Props) {
  const plugin = React.useMemo(() => Autoplay({ delay: 2000, stopOnInteraction: true }), []);

  return (
    <div className='w-full px-4'>
      <Carousel
        plugins={[plugin]}
        className='mx-5'
        onMouseEnter={plugin.stop}
        onMouseLeave={plugin.reset}
      >
        <CarouselContent>
          {images.length === 0 ? (
            <CarouselItem>
              <div className='h-full w-full flex justify-center items-center'>
                <Card>
                  <img
                    src={'/images/default_car.png'}
                    alt='Car'
                    className='object-cover rounded-lg'
                  />
                </Card>
              </div>
            </CarouselItem>
          ) : (
            images?.map((image) => (
              <CarouselItem key={image?.public_id}>
                <div className='h-full w-full flex justify-center items-center'>
                  <Card>
                    <img src={image?.url} alt='Car' className='object-cover rounded-lg' />
                  </Card>
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
