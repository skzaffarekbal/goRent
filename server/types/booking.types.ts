export type BookingInput = {
  car: string;
  startDate: Date;
  endDate: Date;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  amount: {
    rent: number;
    discount: number;
    tax: number;
    total: number;
  };
  daysOfRent: number;
  rentPerDay: number;
  additionalNote: string;
};
