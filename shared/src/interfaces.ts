export const CarStatus = ['Draft', 'Active', 'Archived'] as const;
export const CarBrand = [
  'Audi',
  'BMW',
  'Ford',
  'Honda',
  'Hyundai',
  'Nissan',
  'Toyota',
  'Mercedes-Benz',
  'Volkswagen',
  'Porsche',
  'Kia',
  'Mazda',
  'Subaru',
  'Lexus',
  'Infiniti',
  'Jaguar',
  'Land Rover',
] as const;
export const CarCategories = [
  'Sedan',
  'Convertible',
  'SUV',
  'Hatchback',
  'Coupe',
  'Pickup',
  'Van',
  'Truck',
  'Minivan',
  'Wagon',
  'Jeep',
] as const;
export const CarFuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'] as const;
export const CarTransmissions = ['Automatic', 'Manual', 'CVT'] as const;
export const CarDoors = [2, 4, 5, 6] as const;
export const CarSeats = [2, 4, 5, 7, 8, 9, 10, 12, 15] as const;

export interface ICar {
  id: string;
  name: string;
  description: string;
  status: string;
  rentPerDay: number;
  address: string;
  location: {
    type: 'Point';
    coordinates: number[];
    formattedAddress: string;
    streetName?: string;
    city?: string;
    state?: string;
    stateCode?: string;
    zipcode?: string;
    country?: string;
    countryCode?: string;
  };
  images: {
    url: string;
    public_id: string;
  }[];
  reviews: string[];
  brand: string;
  year: number;
  transmission: string;
  doors: number;
  seats: number;
  mileage: number;
  power: number;
  fuelType: string;
  category: string;
  ratings: {
    value: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}
