import { getAllCars } from '../../controllers/car.controller';

export const carResolvers = {
  Query: {
    getAllCars: async (parent: any, args: any, context: any) => await getAllCars(),
  },
  //   Mutation: {},
};
