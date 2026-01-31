import { z } from "zod";
import { UserScheme } from "../types/user.type";

export const RegisterDto = UserScheme.pick({
    uid: true,
    fullName: true,
    email: true,
    allergenicIngredients: true,
    authProvider: true,
    createdAt: true,
    updatedAt: true,
    password: true,
    profilePic: true
}).extend({
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password must be same",
    path: ["confirmPassword"],
});
export type RegisterDto = z.infer<typeof RegisterDto>;

export const LoginDto = z.object({
    email: z.email({ message: "Invalid email format" }),
    password: z.string().min(6),
});
export type LoginDto = z.infer<typeof LoginDto>;

// Google OAuth DTO
export const GoogleAuthDto = z.object({
    idToken: z.string().min(1, { error: "Google ID token is required" }),
});
export type GoogleAuthDto = z.infer<typeof GoogleAuthDto>;

// Admin Create User DTO - for admin to create users
export const CreateUserDto = UserScheme.pick({
    fullName: true,
    email: true,
    allergenicIngredients: true,
    authProvider: true,
    profilePic: true,
    role: true,
}).extend({
    password: z.string().min(6).optional(),
    allergenicIngredients: UserScheme.shape.allergenicIngredients.optional(),
    authProvider: z.string().default("local"),
    profilePic: UserScheme.shape.profilePic.optional(),
    role: z.enum(["admin", "user"]).default("user"),
});
export type CreateUserDto = z.infer<typeof CreateUserDto>;

