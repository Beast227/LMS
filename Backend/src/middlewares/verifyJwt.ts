import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';

interface CustomNextApiRequest extends NextApiRequest {
  user: string;
}

const verifyJWT = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401);
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(403);
      }

      req.user = decoded.username;
      next();
    }
  );
};

export default verifyJWT;