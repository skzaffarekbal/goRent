import { createCar, getAllCars } from '../../controllers/car.controller';
import { CarInput } from '../../types/car.types';

export const carResolvers = {
  Query: {
    getAllCars: async (parent: any, args: any, context: any) => getAllCars(),
  },
  Mutation: {
    createCar: async (_: any, { carInput }: { carInput: CarInput }, context: any) => {
      return createCar(carInput);
    },
  },
};
