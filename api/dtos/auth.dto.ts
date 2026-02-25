import { z } from "zod";
import { UserScheme } from "../types/user.type";

const passwordSchema = z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

export const RegisterDto = UserScheme.pick({
    uid: true,
    fullName: true,
    email: true,
    allergenicIngredients: true,
    authProvider: true,
    createdAt: true,
    updatedAt: true,
    profilePic: true
}).extend({
    password: passwordSchema,
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password must be same",
    path: ["confirmPassword"],
});
export type RegisterDto = z.infer<typeof RegisterDto>;

export const LoginDto = z.object({
    email: z.email({ message: "Invalid email format" }),
    password: z.string().min(1, { message: "Password is required" }),
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
    password: passwordSchema.optional(),
    allergenicIngredients: UserScheme.shape.allergenicIngredients.optional(),
    authProvider: z.string().default("local"),
    profilePic: UserScheme.shape.profilePic.optional(),
    role: z.enum(["admin", "user"]).default("user"),
});
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const ResetPasswordDto = z.object({
    newPassword: passwordSchema,
});
export type ResetPasswordDto = z.infer<typeof ResetPasswordDto>;

