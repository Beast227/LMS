import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import custom middleware and modules
import corOptions from './src/config/corsOptions';
import connectDB from './src/db/db';
import verifyJWT from './src/middlewares/verifyJwt';
import credentials from './src/middlewares/credentials';
import adminLoginRoute from './src/routes/admin/adminLoginRoute';
import adminRegistration from './src/routes/admin/adminRegistration'
import teacherResitstrationRoute from './src/routes/teacher/teacherRegistrationRoute'
import refreshTokenRoute from './src/routes/refreshTokenRoute'
import teacherLoginRoute from './src/routes/teacher/teacherLoginRoute'
import generateUniqueEmail from './src/routes/admin/generateEmailRoute'
import courseRoute from './src/routes/admin/courseRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Connection with MongoDB
connectDB();

// Handle options credentials check - before cors!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corOptions));

// Built-in middleware to handle URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for JSON
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Routes
app.use('/adminLogin', adminLoginRoute);
app.use('/adminRegister', adminRegistration)
app.use('/teacherRegistration', teacherResitstrationRoute)
app.use('/adminRefresh', refreshTokenRoute)
app.use('/teacherLogin', teacherLoginRoute)
app.use('/generateEmail', generateUniqueEmail)
app.use('/course', courseRoute); 

// Verification with JWT
app.use(verifyJWT);

// Checking the connection is connected or not with the database
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
