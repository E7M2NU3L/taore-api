import type { NextFunction, Request, Response } from "express";

// Extend Error to include a statusCode property
interface CustomError extends Error {
    statusCode?: number;
}

const GlobalErr = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    const statusCode = err.statusCode ?? 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

export default GlobalErr;
