import allowedOrigins from './allowedOrigins';

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      // Allow requests without 'Origin' header (like those from same-origin or tools like Postman)
      callback(null, true);
    } else if (allowedOrigins.indexOf(origin) !== -1) {
      // Allow requests from allowed origins
      callback(null, true);
    } else {
      // Reject requests from other origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
