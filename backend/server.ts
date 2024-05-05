import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import pool from './db/connect';
const app = express();
const port = process.env.PORT || 5500;
import errorHandler from './middleware/errorMiddleware';
import userRoutes from './routes/userRoutes';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);

async function testDatabaseConnection(){
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log('Connected to DB');
    connection.release();
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

async function startServer() {
  if (await testDatabaseConnection()) {
    app.use(errorHandler);
      app.listen(port, () => {
          console.log(`Server is running on http://localhost:${port}`);
      });
  } else {
      console.error('Server did not start due to database connection failure');
  }
}

startServer();