import { IRecipe } from "../models/recipe.model";
import { IRecipeReposiory, RecipeRepository } from "../repositories/recipe.repository";
import { IUserRecipeRepository, UserRecipeRepository } from "../repositories/user-recipe.repository";
import { RecipeType } from "../types/recipe.type";

export class RecipeService {
    private recipeRepository: IRecipeReposiory;
    private userRecipeRepository: IUserRecipeRepository;

    constructor(
        recipeRepository: IRecipeReposiory = new RecipeRepository(),
        userRecipeRepository: IUserRecipeRepository = new UserRecipeRepository()
    ) {
        this.recipeRepository = recipeRepository;
        this.userRecipeRepository = userRecipeRepository;
    }

    async saveRecipe(newRecipe: IRecipe): Promise<IRecipe> {
        return this.recipeRepository.saveRecipe(newRecipe);
    }

    async getRecipe(recipeId: string): Promise<IRecipe | null> {
        return this.recipeRepository.getRecipe(recipeId);
    }

    async getAllRecipes(page?: string, size?: string, searchTerm?: string) {
        const currentPage = page ? parseInt(page, 10) : 1;
        const pageSize = size ? parseInt(size, 10) : 10;
        const { recipe, total } = await this.recipeRepository.getAllRecipe(currentPage, pageSize, searchTerm);
        const pagination = {
            page: currentPage,
            size: pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        };
        return { recipe, pagination };
    }

    async getPublicRecipes(page?: string, size?: string, searchTerm?: string) {
        const currentPage = page ? parseInt(page, 10) : 1;
        const pageSize = size ? parseInt(size, 10) : 10;
        const { recipe, total } = await this.recipeRepository.getPublicRecipes(currentPage, pageSize, searchTerm);
        const pagination = {
            page: currentPage,
            size: pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        };
        return { recipe, pagination };
    }

    async getLikedRecipes(userId: string, page?: string, size?: string, searchTerm?: string) {
        const currentPage = page ? parseInt(page, 10) : 1;
        const pageSize = size ? parseInt(size, 10) : 10;
        const { recipe, total } = await this.recipeRepository.getLikedRecipes(userId, currentPage, pageSize, searchTerm);
        const pagination = {
            page: currentPage,
            size: pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        };
        return { recipe, pagination };
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

    /**
     * Delete a recipe and all its copies in user cookbooks
     * Used when the owner deletes their recipe
     */
    async deleteRecipeWithCascade(recipeId: string): Promise<{ deleted: boolean; copiesDeleted: number }> {
        const existing = await this.recipeRepository.getRecipe(recipeId);
        if (!existing) {
            return { deleted: false, copiesDeleted: 0 };
        }

        // Delete all user recipe copies first
        const copiesDeleted = await this.userRecipeRepository.deleteByOriginalRecipeId(recipeId);

        // Delete the original recipe
        await this.recipeRepository.deleteRecipe(recipeId);

        return { deleted: true, copiesDeleted };
    }

    async toggleSaveRecipe(recipeId: string, userId: string): Promise<IRecipe | null> {
        return this.recipeRepository.toggleLike(recipeId, userId);
    }
}
