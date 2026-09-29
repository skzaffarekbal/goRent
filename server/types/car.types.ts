export type CarInput = {
  name: string;
  description: string;
  rentPerDay: number;
  address: string;
  images: { url: string; public_id: string }[];
  brand: string;
  year: number;
  transmission: string;
  mileage: number;
  power: number;
  seats: number;
  doors: number;
  fuelType: string;
  category: string;
};
