import { z } from "zod";

export const UserScheme = z.object({
    uid: z.string().min(1, { error: "UID is required" }),
    fullName: z.string().min(1, { error: "Username is required" }),
    email: z.email().min(1, { error: "Email is required" }),
    allergenicIngredients: z.array(z.string()).default([]),
    authProvider: z.string().min(1, { error: "Auth provider is required" }),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

export type User = z.infer<typeof UserScheme>;