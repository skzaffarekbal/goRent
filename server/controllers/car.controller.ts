import Car from '../models/car.model';
import { CarInput } from '../types/car.types';

export const getAllCars = async () => {
  const cars = await Car.find();
  return cars;
};

export const createCar = async (carInput: CarInput) => {
  const newCar = await Car.create(carInput);
  return newCar;
};

export const getCarById = async (carId: string) => {
  const car = await Car.findById(carId);
  if (!car) throw new Error('Car not found');
  return car;
};
