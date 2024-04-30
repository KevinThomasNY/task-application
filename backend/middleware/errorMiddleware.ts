import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode: number = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error('Error:', err); 

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
