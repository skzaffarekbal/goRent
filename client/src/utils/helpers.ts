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

export const errorWrapper = async <T>(fn: () => Promise<T> | T): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    console.log('Error: ', error);
    errorToast(error);
  }
};

// John Doe -> JD
export const getUserNameInitials = (fullname?: string) => {
  if (!fullname) {
    return 'U';
  }
  const names = fullname.split(' ');
  return names
    .map((name) => name[0])
    .join('')
    .toUpperCase();
};

export const calculateAmount = (rentPerDay: number, daysOfRent: number) => {
  const rent = rentPerDay * daysOfRent;
  const tax = rent * 0.15;
  const discount = 0;
  const total = rent + tax - discount;

  return { rent, tax, discount, total };
};

export const adjustDateToLocalTimeZone = (date: Date | undefined) => {
  if (!date) return null;

  const localDate = new Date(date);
  localDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return localDate;
};
