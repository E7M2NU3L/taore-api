import { z } from "zod";

export const LoginSchemas = z.object({
    email : z.string().email({
        message : "Please enter a valid email address"
    }),
    password : z.string().min(8, {
        message : "Password must be at least 8 characters long"
    })
});

export const RegisterSchema = z.object({
    firstname : z.string().min(2, {
        message : "First name must be at least 2 characters"
    }),
    lastname : z.string().default("").optional(),
    email : z.string().email({
        message : "Enter a valid email address"
    }),
    password : z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmpassword : z.string()
}).refine((data) => data.password === data.confirmpassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

export const ResetPasswordSchema = z.object({
    password : z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

    confirmpassword : z.string()
}).refine((data) => data.password === data.confirmpassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

export const UpdateUserSchema = z.object({
    firstname : z.string().min(2, {
        message : "First name must be at least 2 characters"
    }),
    lastname : z.string().default("").optional(),
    Bio : z.string(),
    phone : z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^\+?\d+$/, "Phone number must contain only numbers and an optional leading '+'"),
    address: z.string()
    .min(5, "Address must be at least 5 characters long")
    .max(200, "Address must not exceed 200 characters"),
});

export const UpdateProfilePic = z.object({
    profilePic : z.string().url()
}); 