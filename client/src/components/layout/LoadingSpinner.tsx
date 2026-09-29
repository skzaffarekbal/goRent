import { cn } from 'cn';
import { Loader } from 'lucide-react';

type Props = {
  size?: number;
  className?: string;
  fullScreen?: boolean;
};

const LoadingSpinner = ({ size = 5, className, fullScreen = false }: Props) => {
  const spinner = <Loader className={cn('animate-spin', className)} size={size} />;

  if (fullScreen) {
    return <div className='flex justify-center items-center h-screen'>{spinner}</div>;
  }

  return spinner;
};

export default LoadingSpinner;
