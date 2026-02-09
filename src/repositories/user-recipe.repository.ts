import { UserRecipeModel, IUserRecipe } from "../models/user-recipe.model";

export interface IUserRecipeRepository {
    addToCookbook(userRecipe: IUserRecipe): Promise<IUserRecipe>;
    savePrivateRecipe(userRecipe: IUserRecipe): Promise<IUserRecipe>;
    getUserCookbook(userId: string, page: number, size: number, searchTerm?: string): Promise<{ recipes: Array<IUserRecipe>; total: number }>;
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

    async getUserCookbook(userId: string, page: number, size: number, searchTerm?: string): Promise<{ recipes: Array<IUserRecipe>; total: number }> {
        const filter: any = { userId };
        if (searchTerm) {
            filter.$or = [
                { recipeName: { $regex: searchTerm, $options: 'i' } },
                { cuisine: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        const [recipes, total] = await Promise.all([
            UserRecipeModel.find(filter).sort({ addedAt: -1 }).skip((page - 1) * size).limit(size),
            UserRecipeModel.countDocuments(filter)
        ]);
        return { recipes, total };
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
