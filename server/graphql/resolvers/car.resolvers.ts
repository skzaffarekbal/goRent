import {
  createCar,
  deleteCar,
  getAllCars,
  getCarById,
  updateCar,
} from '../../controllers/car.controller';
import { CarFilters, CarInput, DateFilters } from '../../types/car.types';

export const carResolvers = {
  Query: {
    getAllCars: (
      parent: any,
      {
        page,
        filters,
        query,
        location,
        dateFilters,
      }: {
        page: number;
        filters: CarFilters;
        query: string;
        location: string;
        dateFilters: DateFilters;
      },
      context: any,
    ) => getAllCars(page, filters, query, location, dateFilters),
    getCarById: (_: any, { carId }: { carId: string }, context: any) => getCarById(carId),
  },
  Mutation: {
    createCar: (_: any, { carInput }: { carInput: CarInput }, context: any) => {
      return createCar(carInput);
    },
    updateCar: (
      _: any,
      { carId, carInput }: { carId: string; carInput: CarInput },
      context: any,
    ) => {
      return updateCar(carId, carInput);
    },
    deleteCar: (_: any, { carId }: { carId: string }, context: any) => {
      return deleteCar(carId);
    },
  },
};
