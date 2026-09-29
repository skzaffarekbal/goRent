import {
  createCar,
  deleteCar,
  getAllCars,
  getCarById,
  updateCar,
} from '../../controllers/car.controller';
import { CarFilters, CarInput } from '../../types/car.types';

export const carResolvers = {
  Query: {
    getAllCars: async (
      parent: any,
      { filters, query }: { filters: CarFilters; query: string },
      context: any,
    ) => await getAllCars(filters, query),
    getCarById: async (_: any, { carId }: { carId: string }, context: any) =>
      await getCarById(carId),
  },
  Mutation: {
    createCar: async (_: any, { carInput }: { carInput: CarInput }, context: any) => {
      return await createCar(carInput);
    },
    updateCar: async (
      _: any,
      { carId, carInput }: { carId: string; carInput: CarInput },
      context: any,
    ) => {
      return await updateCar(carId, carInput);
    },
    deleteCar: async (_: any, { carId }: { carId: string }, context: any) => {
      return await deleteCar(carId);
    },
  },
};
