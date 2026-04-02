import {z} from "zod";

export const FoodPreferenceScheme = z.object({
    prefId:z.string().min(1,{error:"Preference Id required"}),
    preferences: z.array(z.string()).default([]),
    ownerId:z.string().min(1, {error:"Owner id required"}),
    createdAt:z.coerce.date().default(()=>new Date()),
    updatedAt:z.coerce.date().default(()=>new Date())
});

export type FoodPreferenceType = z.infer<typeof FoodPreferenceScheme>;