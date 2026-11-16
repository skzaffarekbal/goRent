import dotenv from 'dotenv';
import { connectDB } from '../config/dbConnect';
import Car from '../models/car.model';
import { cars } from './data';

dotenv.config({ path: '.env' });

const seedCars = async () => {
  try {
    await connectDB();
    await Car.deleteMany();
    console.log('Deleted all cars');

    for (const carData of cars) {
      const car = new Car(carData);
      car.status = 'Active';
      await car.save();
    }
    console.log('Inserted all cars');

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedCars();
