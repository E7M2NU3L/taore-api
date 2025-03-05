import 'dotenv/config';

import { NextFunction, Request, Response } from "express";
import { LoginSchemas, RegisterSchema, ResetPasswordSchema, UpdateProfilePic, UpdateUserSchema } from "../schemas/auth-schemas";
import AppErr from "../utils/app-err";
import { User } from "../models/user-model";
import { BcryptService } from "../services/bcrypt-service";
import { JwtService } from "../services/jwt-service";
import { NodemailerService } from '../services/nodemailer-service';

class AuthControllers {
    private bcryptService : BcryptService;
    private jwtService : JwtService;
    private mailService : NodemailerService;

    constructor() {
        this.bcryptService = new BcryptService();
        this.jwtService = new JwtService();
        this.mailService = new NodemailerService();
    }

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
            const FoundUser : any = await User.find({
                email : parsedBody.data.email,
            });
            if (!FoundUser) {
                return next(new AppErr("User not Found, try creating an Account", 301));
            }

            // compare if password is correct
            const hashedPassword : string = FoundUser?.password;
            const IsPasswordCorrect = this.bcryptService.compareHash(parsedBody.data.password, hashedPassword);
            if (!IsPasswordCorrect) {
                return next(new AppErr("Invalid Password", 301));
            }

            // generate Jwt Token
            const payload = {
                email : FoundUser?.email ?? "",
                id : FoundUser?._id ?? "",
            };
            const token = this.jwtService.generateToken(payload);
            if (!token) {
                return next(new AppErr("Failed to generate JWT Token", 404));
            }

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

    async RegisterUser(req : Request, res : Response, next : NextFunction) {
        try {
            // get input
            const body = req.body;

            // validate input
            const parsedBody = await RegisterSchema.safeParseAsync(body);
            if (!parsedBody.success) {
                return next(new AppErr("Invalid Input Credentials", 301));
            }

            // find if user exists
            const FoundUser : any = await User.find({
                email : parsedBody.data.email,
            });
            if (FoundUser?.email) {
                return next(new AppErr("User Already Found, try logging in", 301));
            }

            // hash the password
            const hashed_password : string = await this.bcryptService.generateHash(parsedBody.data.password);
            if (!hashed_password) {
                return next(new AppErr("Invalid Password", 301));
            }

            // create the user
            const new_user = new User(parsedBody.data);
            if (!new_user) {
                return next(new AppErr("Failed to create user account", 301));
            }
            await new_user.save();

            // return response
            return res.status(201).json({
                status : true,
                message : "User has been registered successfully"
            });
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }

    async LogoutUser(req : Request, res : Response, next : NextFunction) {
        try {
            res.clearCookie("auth_token");

            return res.status(201).json({
                status : true,
                message : "User has been logged out successfully"
            })
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }

    async fetchCurrentUser(req : Request, res : Response, next : NextFunction) {
        try {
            // get user data
            const token : string = req.cookies.auth_token;
            const payload : any = this.jwtService.verifyToken(token);
            if (!payload?.email) {
                return next(new AppErr("User is not authenticated, try logging in", 304));
            }

            const user = await User.findById(payload?.id);
            if (!user) {
                return next(new AppErr("User not found", 304));
            }
             
            return res.status(201).json({
                status : true,
                message : "User data has been fetched successfully",
                user
            })
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }

    async SendOtp(req : Request, res : Response, next : NextFunction) {
        try {
            // get user data
            const token : string = req.cookies.auth_token;
            const payload : any = this.jwtService.verifyToken(token);
            if (!payload?.email) {
                return next(new AppErr("User is not authenticated, try logging in", 304));
            }

            // generate otp
            const numbers = [0,1,2,3,4,5,6,7,8,9]

            let i = 0;
            let otp = "";
            while (i < 6) {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                otp += numbers[randomIndex];
                numbers.splice(randomIndex, 1);
                i++;
            }

            // mail service
            const subject : string = "Reset Password <--OTP--> from Taore Inc.";
            const message : string = `
                Welcome User, You have been requested to reset your password, from our side we have generated an One Time Password [OTP] for your confirmation \n \n

                your OTP is ${otp}\n
                Kindly enter it in the form which you can access at ${process.env.NODE_ENV === "production" ? process.env.BASE_URL + "/verify-otp" : process.env.BASE_URL_PROD + "/verify-otp"} \n\n

                Thanks, \n
                Emmanuel, Founder of Taore, \n
                Jehr Tech Solutions
            `;
            await this.mailService.SendMail(payload?.email, subject, message);

            // generating otp token
            const otp_payload = {
                email : payload?.email,
                otp
            };
            const otp_token : string = this.jwtService.generateToken(otp_payload);

            // storing the otp token in cookies
            res.cookie("otp_token", otp_token);

            // success response
            return res.status(201).json({
                status : true,
                message : "Otp has been sent to your email address"
            });
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }

    async VerifyOtp(req : Request, res : Response, next : NextFunction) {
        try {
            // get user data
            const token : string = req.cookies.auth_token;
            const payload : any = this.jwtService.verifyToken(token);
            if (!payload?.email) {
                return next(new AppErr("User is not authenticated, try logging in", 304));
            }

            // get otp token from the cookies
            const otp_token : string = req.cookies.otp_token;
            const otp_payload : any = this.jwtService.verifyToken(otp_token);
            if (!otp_payload?.email || otp_payload?.otp!== req.body.otp) {
                return next(new AppErr("Invalid OTP", 304));
            }

            // get request from the body
            const body = req.body;

            // validation
            if (!body.otp) {
                return next(new AppErr("Invalid input credentials", 304));
            }

            // checking if otp is correct
            if (body.otp != otp_payload?.otp) {
                return next(new AppErr("Incorrect OTP", 304));
            }

            // storing result cookies
            res.cookie("otp_verified", true);

            return res.status(201).json({
                status : true,
                message : "Otp has verified for your email address"
            });
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }

    async ResetPassword(req : Request, res : Response, next : NextFunction) {
        try {
            // get user data
            const token : string = req.cookies.auth_token;
            const payload : any = this.jwtService.verifyToken(token);
            if (!payload?.email) {
                return next(new AppErr("User is not authenticated, try logging in", 304));
            }

            // input 
            const body = req.body;

            // validate input
            const parsedBody = await ResetPasswordSchema.safeParseAsync(body);
            if (!parsedBody.success) {
                return next(new AppErr(parsedBody.error.message, 304));
            }

            // check if otp is verified
            const verificationStatus = req.cookies.otp_verified;
            if (!verificationStatus) {
                return next(new AppErr("Otp verification is required", 304));
            }

            // hash the password
            const hashed_password : string = await this.bcryptService.generateHash(parsedBody.data.password);

            // reset the password
            await User.findByIdAndUpdate(payload?.id, {
                password : hashed_password
            });

            return res.status(201).json({
                status : true,
                message : "your password has been reset successfully"
            });
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }

    async MfaSendOtp(req : Request, res : Response, next : NextFunction) {
        try {
            // get user data
            const token : string = req.cookies.auth_token;
            const payload : any = this.jwtService.verifyToken(token);
            if (!payload?.email) {
                return next(new AppErr("User is not authenticated, try logging in", 304));
            }

            // generate otp
            const numbers = [0,1,2,3,4,5,6,7,8,9]

            let i = 0;
            let otp = "";
            while (i < 6) {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                otp += numbers[randomIndex];
                numbers.splice(randomIndex, 1);
                i++;
            }

            // mail service
            const subject : string = "Reset Password <--OTP--> from Taore Inc.";
            const message : string = `
                Welcome User, You have been requested to authorize your account with your email address, from our side we have generated an One Time Password [OTP] for your confirmation \n \n

                your OTP is ${otp}\n
                Kindly enter it in the form which you can access at ${process.env.NODE_ENV === "production" ? process.env.BASE_URL + "/mfa-verify" : process.env.BASE_URL_PROD + "/mfa-verify"} \n\n

                Thanks, \n
                Emmanuel, Founder of Taore, \n
                Jehr Tech Solutions
            `;
            await this.mailService.SendMail(payload?.email, subject, message);

            // generating otp token
            const otp_payload = {
                email : payload?.email,
                otp
            };
            const otp_token : string = this.jwtService.generateToken(otp_payload);

            // storing the otp token in cookies
            res.cookie("mfa_otp", otp_token);

            // success response
            return res.status(201).json({
                status : true,
                message : "Otp has been sent to your email address"
            });
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }

    async MfaVerifyOtp(req : Request, res : Response, next : NextFunction) {
        try {
             // get user data
             const token : string = req.cookies.auth_token;
             const payload : any = this.jwtService.verifyToken(token);
             if (!payload?.email) {
                 return next(new AppErr("User is not authenticated, try logging in", 304));
             }
 
             // get otp token from the cookies
             const otp_token : string = req.cookies.mfa_otp;
             const otp_payload : any = this.jwtService.verifyToken(otp_token);
             if (!otp_payload?.email || otp_payload?.otp!== req.body.otp) {
                 return next(new AppErr("Invalid OTP", 304));
             }
 
             // get request from the body
             const body = req.body;
 
             // validation
             if (!body.otp) {
                 return next(new AppErr("Invalid input credentials", 304));
             }
 
             // checking if otp is correct
             if (body.otp != otp_payload?.otp) {
                 return next(new AppErr("Incorrect OTP", 304));
             }

             // update your mfa status in the db
             await User.findByIdAndUpdate(payload?.id, {
                 mfa : true
             });
 
             return res.status(201).json({
                 status : true,
                 message : "Your email address is verified, you are now an authorized user."
             });
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }

    async UpdateUser(req : Request, res : Response, next : NextFunction) {
        try {
            // get user data
            const token : string = req.cookies.auth_token;
            const payload : any = this.jwtService.verifyToken(token);
            if (!payload?.email) {
                return next(new AppErr("User is not authenticated, try logging in", 304));
            }

            // validate input
            const parsedBody = await UpdateUserSchema.safeParseAsync(req.body);
            if (!parsedBody.success) {
                return next(new AppErr(parsedBody.error.message, 304));
            }

            // update User
            await User.findByIdAndUpdate(payload?.id, parsedBody.data);

            return res.status(201).json({
                status : true,
                message : "User Profile has been updated successfully"
            });
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }

    async DeleteUser(req : Request, res : Response, next : NextFunction) {
        try {
            // get user data
            const token : string = req.cookies.auth_token;
            const payload : any = this.jwtService.verifyToken(token);
            if (!payload?.email) {
                return next(new AppErr("User is not authenticated, try logging in", 304));
            }

            // logout user and deactivate cookies
            res.clearCookie('auth_token');
            
            // delete user account
            await User.findByIdAndDelete(payload?.id);

            return res.status(201).json({
                status : true,
                message : "User Profile has been deleted successfully"
            });
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }

    async UpdateProfilePicture(req : Request, res : Response, next : NextFunction) {
        try {
            // get user data
            const token : string = req.cookies.auth_token;
            const payload : any = this.jwtService.verifyToken(token);
            if (!payload?.email) {
                return next(new AppErr("User is not authenticated, try logging in", 304));
            }

            // validate input
            const parsedBody = await UpdateProfilePic.safeParseAsync(req.body);
            if (!parsedBody.success) {
                return next(new AppErr(parsedBody.error.message, 304));
            }

            // update User
            await User.findByIdAndUpdate(payload?.id, parsedBody.data);

            return res.status(201).json({
                status : true,
                message : "User Profile has been updated successfully"
            });
        } catch (error) {
            return next(new AppErr(error instanceof Error ? error.message : "Something went wrong", 404));
        }
    }
}

export const authControllers = new AuthControllers();