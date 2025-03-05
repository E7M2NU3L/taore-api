import express, { request } from 'express';
import type { NextFunction, Request, Response, Router} from 'express';
import { authControllers } from '../controller/auth-controller';
import { authMiddlewares } from '../middleware/auth-middlewares';

// auth Router
const AuthRouter : Router = express.Router();

// routes
AuthRouter.get("/current-user", authMiddlewares.IsLoggedIn, (req : Request, res : Response, next : NextFunction) => {
    authControllers.fetchCurrentUser(req, res, next);
});
AuthRouter.post("/login", (req : Request, res : Response, next : NextFunction) => {
    authControllers.login(req, res, next);
});
AuthRouter.post("/register", (req : Request, res : Response, next : NextFunction) => {
    authControllers.RegisterUser(req, res, next);
});
AuthRouter.post("/logout", authMiddlewares.IsLoggedIn, (req : Request, res : Response, next : NextFunction) => {
    authControllers.LogoutUser(req, res, next);
});
AuthRouter.put("/update-user", authMiddlewares.IsLoggedIn, (req : Request, res : Response, next : NextFunction) => {
    authControllers.UpdateUser(req, res, next);
});
AuthRouter.delete("/delete-user", authMiddlewares.IsLoggedIn, (req : Request, res : Response, next : NextFunction) => {
    authControllers.DeleteUser(req, res, next);
});
AuthRouter.post("/send-mail", authMiddlewares.IsLoggedIn, (req : Request, res : Response, next : NextFunction) => {
    authControllers.SendOtp(req, res, next);
});
AuthRouter.post("/verify-otp", authMiddlewares.IsLoggedIn, (req : Request, res : Response, next : NextFunction) => {
    authControllers.VerifyOtp(req, res, next);
});
AuthRouter.put("/reset-password", authMiddlewares.IsLoggedIn, (req : Request, res : Response, next : NextFunction) => {
    authControllers.ResetPassword(req, res, next);
});
AuthRouter.post("/update-profile-pic", authMiddlewares.IsLoggedIn, (req : Request, res : Response, next : NextFunction) => {
    authControllers.UpdateProfilePicture(req, res, next);
});
AuthRouter.post("/mfa-send-mail", authMiddlewares.IsLoggedIn, (req : Request, res : Response, next : NextFunction) => {
    authControllers.MfaSendOtp(req, res, next);
});
AuthRouter.post("/mfa-verify-otp", authMiddlewares.IsLoggedIn, (req : Request, res : Response, next : NextFunction) => {
    authControllers.MfaVerifyOtp(req, res, next);
});

// exporting the modules
export default AuthRouter;