import { NextFunction, Request, Response } from "express";
import { LoginSchemas } from "../schemas/auth-schemas";
import AppErr from "../utils/app-err";
import { User } from "../models/user-model";

class AuthControllers {
    constructor() {}

    async login(req : Request, res : Response, next : NextFunction) {
        try {
            // get input
            const body = req.body;

            // validate input
            const parsedBody = await LoginSchemas.safeParseAsync(body);
            if (!parsedBody.success) {
                return next(new AppErr("Invalid Input Credentials", 301));
            }

            // authenticate user
            const FoundUser = await User.find({
                email : parsedBody.data.email,
            });

            // compare if password is correct
            const IsPasswordCorrect = '';
            if (!IsPasswordCorrect) {
                return next(new AppErr("Invalid Password", 301));
            }

            // generate Jwt Token
            const payload = {};
            const token = "";

            // store cookie
            res.cookie("auth-token", token);

            // return response
            return res.status(201).json({
                status : true,
                message : "User has been loggedIn successfully",
                token
            });
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }
}