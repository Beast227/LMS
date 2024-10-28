import { Request, Response, NextFunction } from 'express';
import allowedOrigins from '../config/allowedOrigins';

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  next();
};

export default credentials;
