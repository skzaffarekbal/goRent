import { format } from 'date-fns';
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

export const formatDate = (date: Date | string, formatString: string = 'yyyy-MM-dd') => {
  if (typeof date === 'string') {
    date = new Date(parseInt(date));
  }
  return format(date, formatString);
};

export const getAllDatesBetween = (startDate: Date, endDate: Date) => {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(formatDate(new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const parseTimestampDate = (timeStamp: string) => {
  return new Date(parseInt(timeStamp)).toLocaleString();
};

export const calculateTablePaginationStart = (currentPage: number, resPerPage: number) => {
  const start = (currentPage - 1) * resPerPage + 1;
  return start;
};

export const calculateTablePaginationEnd = (
  currentPage: number,
  resPerPage: number,
  totalCount: number,
) => {
  const end = Math.min(currentPage * resPerPage, totalCount);
  return end;
};

export const generateSvg = (
  price: string,
  bgColor: string = '#18181b',
  textColor: string = '#ffffff',
) => {
  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="80"
  height="48"
  viewBox="0 0 80 48"
  fill="none"
>
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Main Pill Badge with Shadow -->
  <g filter="url(#shadow)">
    <rect x="4" y="2" width="72" height="34" rx="17" fill="${bgColor}" stroke="#ffffff" stroke-width="2.5" />
    <!-- Pin Arrow Tip -->
    <path d="M40 44L34 34H46L40 44Z" fill="${bgColor}" />
  </g>

  <!-- Price Text -->
  <text
    x="40"
    y="22"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="${textColor}"
    font-size="14px"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="700"
    letter-spacing="-0.2px"
  >
    $${price}
  </text>
</svg>`;
};

export const isValidQueryValue = (value: unknown) => {
  return value !== undefined && value !== null && value !== '';
};

export const formatQueryParam = (key: string, value: unknown) => {
  return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
};

export const buildQueryString = (queries: Record<string, unknown>) => {
  return Object.entries(queries)
    .filter(([, value]) => isValidQueryValue(value))
    .map(([key, value]) => formatQueryParam(key, String(value)))
    .join('&');
};
