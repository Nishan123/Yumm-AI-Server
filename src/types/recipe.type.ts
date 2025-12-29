import {z} from "zod";

export const RecipeScheme = z.object({
    recipeId: z.string().min(1,{error:"Recipe ID required"}),
    recipeName:z.string().min(1,{error: "Recipe name is required"}),
    generatedBy:z.string().min(1,{error:"User Id required"}),
})