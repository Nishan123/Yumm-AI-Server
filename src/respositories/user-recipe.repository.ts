import { UserRecipeModel, IUserRecipe } from "../model/user-recipe.model";

export interface IUserRecipeRepository {
    addToCookbook(userRecipe: IUserRecipe): Promise<IUserRecipe>;
    savePrivateRecipe(userRecipe: IUserRecipe): Promise<IUserRecipe>;
    getUserCookbook(userId: string): Promise<Array<IUserRecipe>>;
    getUserRecipe(userRecipeId: string): Promise<IUserRecipe | null>;
    getUserRecipeByOriginal(userId: string, originalRecipeId: string): Promise<IUserRecipe | null>;
    updateUserRecipe(userRecipe: Partial<IUserRecipe> & { userRecipeId: string }): Promise<IUserRecipe | null>;
    removeFromCookbook(userRecipeId: string): Promise<boolean>;
    isRecipeInCookbook(userId: string, originalRecipeId: string): Promise<boolean>;
    deleteByOriginalRecipeId(originalRecipeId: string): Promise<number>;
}

export class UserRecipeRepository implements IUserRecipeRepository {
    
    async addToCookbook(userRecipe: IUserRecipe): Promise<IUserRecipe> {
        const created = await UserRecipeModel.create(userRecipe);
        return created;
    }

    async savePrivateRecipe(userRecipe: IUserRecipe): Promise<IUserRecipe> {
        const created = await UserRecipeModel.create(userRecipe);
        return created;
    }

    async getUserCookbook(userId: string): Promise<Array<IUserRecipe>> {
        const recipes = await UserRecipeModel.find({ userId }).sort({ addedAt: -1 });
        return recipes;
    }

    async getUserRecipe(userRecipeId: string): Promise<IUserRecipe | null> {
        const recipe = await UserRecipeModel.findOne({ userRecipeId });
        return recipe;
    }

    async getUserRecipeByOriginal(userId: string, originalRecipeId: string): Promise<IUserRecipe | null> {
        const recipe = await UserRecipeModel.findOne({ userId, originalRecipeId });
        return recipe;
    }

    async updateUserRecipe(userRecipe: Partial<IUserRecipe> & { userRecipeId: string }): Promise<IUserRecipe | null> {
        const updated = await UserRecipeModel.findOneAndUpdate(
            { userRecipeId: userRecipe.userRecipeId },
            { $set: userRecipe },
            { new: true }
        );
        return updated;
    }

    async removeFromCookbook(userRecipeId: string): Promise<boolean> {
        const result = await UserRecipeModel.deleteOne({ userRecipeId });
        return result.deletedCount > 0;
    }

    async isRecipeInCookbook(userId: string, originalRecipeId: string): Promise<boolean> {
        const recipe = await UserRecipeModel.findOne({ userId, originalRecipeId });
        return recipe !== null;
    }

    async deleteByOriginalRecipeId(originalRecipeId: string): Promise<number> {
        const result = await UserRecipeModel.deleteMany({ originalRecipeId });
        return result.deletedCount;
    }
}
