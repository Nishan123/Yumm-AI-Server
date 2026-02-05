import { RecipeModel, IRecipe } from "../models/recipe.model";

export interface IRecipeReposiory {
    saveRecipe(newRecipe: IRecipe): Promise<IRecipe>;
    getRecipe(recipeId: string): Promise<IRecipe | null>;
    getAllRecipe(): Promise<Array<IRecipe>>;
    getPublicRecipes(): Promise<Array<IRecipe>>;
    getCurrentUserRecipe(userId: string): Promise<Array<IRecipe>>;
    updateRecipe(recipe: IRecipe): Promise<IRecipe>;
    deleteRecipe(recipeId: string): Promise<void>;
    toggleLike(recipeId: string, userId: string): Promise<IRecipe | null>;
}

export class RecipeRepository implements IRecipeReposiory {

    async getCurrentUserRecipe(userId: string): Promise<Array<IRecipe>> {
        const docs = await RecipeModel.find({ generatedBy: userId }).limit(15);
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
    async getAllRecipe(): Promise<Array<IRecipe>> {
        const recipes = await RecipeModel.find().exec();
        return recipes.map((recipe) => recipe);
    }
    async getPublicRecipes(): Promise<Array<IRecipe>> {
        const recipes = await RecipeModel.find({ isPublic: true }).sort({ createdAt: -1 }).limit(50).exec();
        return recipes;
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