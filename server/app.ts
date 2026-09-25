import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/dbConnect';

dotenv.config({ path: '.env' });

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

connectDB()
  .then(() => {
    console.log('✅ Database connected successfully');
    startServer();
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  });
