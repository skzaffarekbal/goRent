import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center'>
      <div className='max-w-md w-full space-y-8 flex flex-col items-center'>
        {/* Playful Image with a slight bounce animation */}
        <div className='relative mb-8'>
          <div className='absolute -inset-4 bg-primary/20 blur-xl rounded-full animate-pulse' />
          <img
            src='/images/default_car.png'
            alt='404 Illustration'
            className='relative z-10 mx-auto w-64 h-64 object-contain animate-bounce'
            style={{ animationDuration: '3s' }}
          />
        </div>

        {/* Text Content */}
        <div className='space-y-4'>
          <h1 className='text-6xl font-extrabold tracking-tight text-primary'>404</h1>
          <h2 className='text-3xl font-bold tracking-tight'>Oops! Page Not Found</h2>
          <p className='text-muted-foreground text-lg'>
            It seems like you've wandered off the map. The page you are looking for doesn't exist or
            might have been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 w-full justify-center mt-8'>
          <Button asChild variant='outline' size='lg' className='w-full sm:w-auto group'>
            <button onClick={() => window.history.back()}>
              <ArrowLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
              Go Back
            </button>
          </Button>
          <Button asChild size='lg' className='w-full sm:w-auto'>
            <Link to='/'>
              <Home className='mr-2 h-4 w-4' />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
