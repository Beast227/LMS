import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import custom middleware and modules
// import corOptions from './config/corsOptions';
import connectDB from './src/db/db';
// import verifyJWT from './middlewares/verifyJWT';
// import credentials from './middlewares/credentials';

// Load environment variables
dotenv.config();

const app = express();

// Connection with MongoDB
connectDB();

// // Handle options credentials check - before cors!
// // and fetch cookies credentials requirement
// app.use(credentials);

// // Cross Origin Resource Sharing
// app.use(cors(corOptions));

// Built-in middleware to handle URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for JSON
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// // Verification with JWT
// app.use(verifyJWT);

// Example route (add this or other routes)
app.get('/', (req: Request, res: Response) => {
  res.send('API is working');
});

// Checking the connection is connected or not with the database
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});