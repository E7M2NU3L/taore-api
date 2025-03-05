import { NextFunction, Request, Response } from "express";
import AppErr from "../utils/app-err";
import { JwtService } from "../services/jwt-service";

interface CustomError extends Error {
    statusCode? : number;
}

class AuthMiddlewares {
    private jwtService : JwtService;

    constructor() {
        this.jwtService = new JwtService();
    }

    IsLoggedIn = (err : CustomError, req : Request, res : Response, next : NextFunction) => {
        try {
            // get user data
            const token : string = req.cookies.auth_token;
            const payload : any = this.jwtService.verifyToken(token);
            if (!payload?.email) {
                return next(new AppErr("User is not authenticated, try logging in", 304));
            }
    
            next();
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wronf", 404));
        }
    };
}

export const authMiddlewares = new AuthMiddlewares();