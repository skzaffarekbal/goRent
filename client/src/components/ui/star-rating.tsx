import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  numberOfStars?: number;
  size?: number;
  starRatedColor?: string;
  emptyColor?: string;
  className?: string;
  onChange?: (rating: number) => void;
}

export const StarRating = ({
  rating,
  numberOfStars = 5,
  size = 5,
  starRatedColor = '#3b82f6',
  emptyColor = '#cccccc',
  className,
  onChange,
}: StarRatingProps) => {
  const handleClick = (index: number, isHalf: boolean) => {
    const newRating = index + (isHalf ? 0.5 : 1);
    onChange?.(newRating);
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: numberOfStars }).map((_, index) => {
        const isFilled = index + 1 <= rating;
        const isHalf = index + 0.5 <= rating && index + 1 > rating;

        return (
          <div key={index} className={`relative w-${size} h-${size}`}>
            {/* Empty star */}
            <Star
              className={`absolute inset-0 w-${size} h-${size}`}
              color={emptyColor}
              fill={emptyColor}
              strokeWidth={1.5}
            />

            {/* Half / Full star */}
            {(isFilled || isHalf) && (
              <div
                className='absolute inset-0 overflow-hidden'
                style={{
                  width: isHalf ? '50%' : '100%',
                }}
              >
                <Star
                  className={`w-${size} h-${size}`}
                  fill={starRatedColor}
                  color={starRatedColor}
                  strokeWidth={1.5}
                />
              </div>
            )}

            {/* Clickable halves */}
            {onChange && (
              <>
                {/* Left half */}
                <button
                  type='button'
                  aria-label={`Rate ${index + 0.5} stars`}
                  className='absolute inset-y-0 left-0 w-1/2 cursor-pointer'
                  onClick={() => handleClick(index, true)}
                />

                {/* Right half */}
                <button
                  type='button'
                  aria-label={`Rate ${index + 1} stars`}
                  className='absolute inset-y-0 right-0 w-1/2 cursor-pointer'
                  onClick={() => handleClick(index, false)}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
