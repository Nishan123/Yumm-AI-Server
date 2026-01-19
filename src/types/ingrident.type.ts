import {z} from "zod";

export const IngridentScheme = z.object({
    ingridentId : z.string().min(1, {error:"Ingrident ID required"}),
    name: z.string().min(1,{error:"Ingrident name required"}),
    imageUrl : z.string().min(1, {error:"Image Url required"}),
    quantity : z.string().min(1, {error: "Quantity required"}),
    unit : z.string().min(1,{error:"Unit required"})
});

export type IngridentType = z.infer<typeof IngridentScheme>;