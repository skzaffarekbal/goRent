import { toast } from 'sonner';

export const updateSearchParams = (searchParams: URLSearchParams, key: string, value: string) => {
  if (searchParams.has(key)) {
    searchParams.set(key, value);
  } else {
    searchParams.append(key, value);
  }
  return searchParams;
};

export const errorToast = (error: unknown) => {
  toast.error('Something went wrong.', {
    description: (error as Error)?.message || 'An unexpected error occurred.',
  });
};
