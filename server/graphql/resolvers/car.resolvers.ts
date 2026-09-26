import { createCar, getAllCars, getCarById } from '../../controllers/car.controller';
import { CarInput } from '../../types/car.types';

export const carResolvers = {
  Query: {
    getAllCars: async (parent: any, args: any, context: any) => await getAllCars(),
    getCarById: async (parent: any, { carId }: { carId: string }, context: any) =>
      await getCarById(carId),
  },
  Mutation: {
    createCar: async (_: any, { carInput }: { carInput: CarInput }, context: any) => {
      return await createCar(carInput);
    },
  },
};
