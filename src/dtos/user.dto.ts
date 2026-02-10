import { z } from "zod";
import { UserScheme } from "../types/user.type";

// NOTE: profilePic is intentionally excluded from UpdateUserDto.
// Profile pictures must be updated via the dedicated uploadProfilePic endpoint only.
export const UpdateUserDto = UserScheme.pick({
    uid: true,
    fullName: true,
    email: true,
    allergenicIngredients: true,
    authProvider: true,
}).extend({
    fullName: UserScheme.shape.fullName.optional(),
    email: UserScheme.shape.email.optional(),
    allergenicIngredients: UserScheme.shape.allergenicIngredients.optional(),
    authProvider: UserScheme.shape.authProvider.optional(),
    updatedAt: UserScheme.shape.updatedAt.optional(),
    isSubscribedUser: UserScheme.shape.isSubscribedUser.optional(),
    pushyToken: UserScheme.shape.pushyToken.optional()
});
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;