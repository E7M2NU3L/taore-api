import express from 'express';
import type { Router} from 'express';

// auth Router
const AuthRouter : Router = express.Router();

// routes
AuthRouter.get("/current-user");
AuthRouter.post("/login");
AuthRouter.post("/register");
AuthRouter.post("/logout");
AuthRouter.put("/update-user");
AuthRouter.delete("/delete-user");
AuthRouter.post("/send-mail");
AuthRouter.post("/verify-otp");
AuthRouter.put("/reset-password");
AuthRouter.post("/update-profile-pic");

// exporting the modules
export default AuthRouter;