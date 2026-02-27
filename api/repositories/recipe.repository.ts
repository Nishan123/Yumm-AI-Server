import { QueryFilter } from "mongoose";
import { RecipeModel, IRecipe } from "../models/recipe.model";

export interface IRecipeReposiory {
    saveRecipe(newRecipe: IRecipe): Promise<IRecipe>;
    getRecipe(recipeId: string): Promise<IRecipe | null>;
    getAllRecipe(page: number, size: number, searchTerm?: string): Promise<{ recipe: IRecipe[], total: number }>;
    getPublicRecipes(page: number, size: number, searchTerm?: string, filters?: { experienceLevel?: string, mealType?: string, minCalorie?: number, maxCalorie?: number }): Promise<{ recipe: IRecipe[], total: number }>;
    getLikedRecipes(userId: string, page: number, size: number, searchTerm?: string): Promise<{ recipe: IRecipe[], total: number }>;
    getTopPublicRecipes(page: number, size: number, searchTerm?: string): Promise<{ recipe: IRecipe[], total: number }>;
    getCurrentUserRecipe(userId: string): Promise<Array<IRecipe>>;
    updateRecipe(recipe: IRecipe): Promise<IRecipe>;
    deleteRecipe(recipeId: string): Promise<void>;
    toggleLike(recipeId: string, userId: string): Promise<IRecipe | null>;
}

export class RecipeRepository implements IRecipeReposiory {
    async getAllRecipe(page: number, size: number, searchTerm?: string)
        : Promise<{ recipe: IRecipe[]; total: number; }> {
        const filter: QueryFilter<IRecipe> = {};
        if (searchTerm) {
            filter.$or = [
                { recipeName: { $regex: searchTerm, $options: 'i' } },
                { cuisine: { $regex: searchTerm, $options: 'i' } },
            ];
        }
        const [recipe, total] = await Promise.all([
            RecipeModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * size).limit(size),
            RecipeModel.countDocuments(filter)
        ]);
        return { recipe, total };
    }

    async getPublicRecipes(page: number, size: number, searchTerm?: string, filters?: { experienceLevel?: string, mealType?: string, minCalorie?: number, maxCalorie?: number })
        : Promise<{ recipe: IRecipe[]; total: number; }> {
        const filter: QueryFilter<IRecipe> = { isPublic: true };

        if (searchTerm) {
            filter.$or = [
                { recipeName: { $regex: searchTerm, $options: 'i' } },
                { cuisine: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        if (filters) {
            if (filters.experienceLevel) {
                filter.experienceLevel = filters.experienceLevel;
            }
            if (filters.mealType) {
                filter.mealType = { $regex: filters.mealType, $options: 'i' };
            }
            if (filters.minCalorie !== undefined || filters.maxCalorie !== undefined) {
                filter.calorie = {};
                if (filters.minCalorie !== undefined) filter.calorie.$gte = filters.minCalorie;
                if (filters.maxCalorie !== undefined) filter.calorie.$lte = filters.maxCalorie;
            }
        }

        const [recipe, total] = await Promise.all([
            RecipeModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * size).limit(size),
            RecipeModel.countDocuments(filter)
        ]);
        return { recipe, total };
    }

    async getLikedRecipes(userId: string, page: number, size: number, searchTerm?: string)
        : Promise<{ recipe: IRecipe[]; total: number; }> {
        const filter: QueryFilter<IRecipe> = { likes: userId };
        if (searchTerm) {
            filter.$or = [
                { recipeName: { $regex: searchTerm, $options: 'i' } },
                { cuisine: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        const [recipe, total] = await Promise.all([
            RecipeModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * size).limit(size),
            RecipeModel.countDocuments(filter)
        ]);
        return { recipe, total };
    }

    async getTopPublicRecipes(page: number, size: number, searchTerm?: string)
        : Promise<{ recipe: IRecipe[]; total: number; }> {
        const matchStage: any = { isPublic: true };
        if (searchTerm) {
            matchStage.$or = [
                { recipeName: { $regex: searchTerm, $options: 'i' } },
                { cuisine: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const pipeline: any[] = [
            { $match: matchStage },
            {
                $addFields: {
                    likesCount: { $size: "$likes" }
                }
            },
            { $sort: { likesCount: -1 } },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [{ $skip: (page - 1) * size }, { $limit: size }]
                }
            }
        ];

        const result = await RecipeModel.aggregate(pipeline);

        const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
        const recipe = result[0].data;

        return { recipe, total };
    }

    async getCurrentUserRecipe(userId: string): Promise<Array<IRecipe>> {
        const docs = await RecipeModel.find({ generatedBy: userId }).sort({ createdAt: -1 }).limit(15);
        return docs;
    }
    async saveRecipe(newRecipe: IRecipe): Promise<IRecipe> {
        const createdUser = await RecipeModel.create(newRecipe);
        return createdUser;
    }
    async getRecipe(recipeId: string): Promise<IRecipe | null> {
        const recipe = await RecipeModel.findOne({ recipeId: recipeId });
        return recipe;
    }

    async updateRecipe(recipe: IRecipe): Promise<IRecipe> {
        const updatedRecipe = await RecipeModel.findOneAndUpdate(
            { recipeId: recipe.recipeId },
            recipe,
            { new: true }
        );
        if (!updatedRecipe) {
            throw new Error(`Recipe with id ${recipe.recipeId} not found`);
        }
        return updatedRecipe;
    }
    async deleteRecipe(recipeId: string): Promise<void> {
        await RecipeModel.deleteOne({ recipeId: recipeId });
    }

    async toggleLike(recipeId: string, userId: string): Promise<IRecipe | null> {
        const recipe = await RecipeModel.findOne({ recipeId });
        if (!recipe) return null;

        const index = recipe.likes.indexOf(userId);
        if (index === -1) {
            recipe.likes.push(userId);
        } else {
            recipe.likes.splice(index, 1);
        }

        await recipe.save();
        return recipe;
    }

}