import { IRecipe } from "../model/recipe.model";
import { IRecipeReposiory, RecipeRepository } from "../respositories/recipe.repository";
import { RecipeType } from "../types/recipe.type";

export class RecipeService {
    private recipeRepository: IRecipeReposiory;

    constructor(recipeRepository: IRecipeReposiory = new RecipeRepository()) {
        this.recipeRepository = recipeRepository;
    }

    async saveRecipe(newRecipe: IRecipe): Promise<IRecipe> {
        return this.recipeRepository.saveRecipe(newRecipe);
    }

    async getRecipe(recipeId: string): Promise<IRecipe | null> {
        return this.recipeRepository.getRecipe(recipeId);
    }

    async getAllRecipes(): Promise<Array<IRecipe>> {
        return this.recipeRepository.getAllRecipe();
    }

    async getCurrentUserRecipes(userId: string): Promise<Array<IRecipe>> {
        return this.recipeRepository.getCurrentUserRecipe(userId);
    }

    async updateRecipe(recipe: IRecipe): Promise<IRecipe | null> {
        const existing = await this.recipeRepository.getRecipe(recipe.recipeId);
        if (!existing) {
            return null;
        }
        return this.recipeRepository.updateRecipe(recipe);
    }

    async deleteRecipe(recipeId: string): Promise<boolean> {
        const existing = await this.recipeRepository.getRecipe(recipeId);
        if (!existing) {
            return false;
        }
        await this.recipeRepository.deleteRecipe(recipeId);
        return true;
    }
}
