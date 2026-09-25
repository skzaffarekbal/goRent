import mongoose from 'mongoose';

export const connectDB = async () => {
  let connectionString: string | undefined;

  if (process.env.NODE_ENV === 'development') {
    connectionString = process.env.MONGO_DB_URL;
  } else if (process.env.NODE_ENV === 'production') {
    connectionString = process.env.PROD_MONGO_DB_URL;
  }

  if (!connectionString) {
    throw new Error('Please provide a connection string');
  }

  await mongoose.connect(connectionString);
};
