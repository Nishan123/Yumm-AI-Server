import { Request, Response } from "express";

import { UpdateUserDto } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { sendSuccess, sendError } from "../utils/response.util";

export class UserController {
	private userService: UserService;

	constructor(userService: UserService = new UserService()) {
		this.userService = userService;
	}

	getAllUsers = async (_req: Request, res: Response): Promise<void> => {
		try {
			const users = await this.userService.getAllUsers();
			sendSuccess(res, users);
		} catch (error) {
			sendError(res, (error as Error).message, 500);
		}
	};

	getUser = async (req: Request, res: Response): Promise<void> => {
		try {
			const { uid } = req.params;
			const user = await this.userService.getUser(uid);
			if (!user) {
				sendError(res, "User not found", 404);
				return;
			}
			sendSuccess(res, user);
		} catch (error) {
			sendError(res, (error as Error).message, 500);
		}
	};

	updateUser = async (req: Request, res: Response): Promise<void> => {
		try {
			const { uid } = req.params;
			const payload: UpdateUserDto = { ...req.body, uid };
			const updated = await this.userService.updateUser(payload);
			if (!updated) {
				sendError(res, "User not found", 404);
				return;
			}
			sendSuccess(res, updated);
		} catch (error) {
			sendError(res, (error as Error).message, 400);
		}
	};

	deleteUser = async (req: Request, res: Response): Promise<void> => {
		try {
			const { uid } = req.params;
			const deleted = await this.userService.deleteUser(uid);
			if (!deleted) {
				sendError(res, "User not found", 404);
				return;
			}
			sendSuccess(res, null, 200, "User deleted successfully");
		} catch (error) {
			sendError(res, (error as Error).message, 500);
		}
	};

	uploadProfilePic = async (req: Request, res: Response): Promise<void> => {
		try {
			const { uid } = req.params;

			if (!req.file) {
				sendError(res, "No file uploaded", 400);
				return;
			}

			// Update user's profilePic using service
			const updatedUser = await this.userService.updateProfilePic(uid, req.file);

			if (!updatedUser) {
				sendError(res, "User not found", 404);
				return;
			}

			sendSuccess(res, updatedUser, 200, "Profile picture uploaded successfully");
		} catch (error) {
			sendError(res, (error as Error).message, 500);
		}
	};

	/**
	 * Delete user with password verification (for emailPassword auth users)
	 */
	deleteUserWithPassword = async (req: Request, res: Response): Promise<void> => {
		try {
			const { uid } = req.params;
			const { password } = req.body;

			if (!password) {
				sendError(res, "Password is required", 400);
				return;
			}

			const deleted = await this.userService.deleteUserWithPassword(uid, password);
			if (deleted) {
				sendSuccess(res, null, 200, "User deleted successfully");
			} else {
				sendError(res, "Failed to delete user", 500);
			}
		} catch (error: any) {
			const statusCode = error.statusCode || 500;
			sendError(res, error.message || "Internal server error", statusCode);
		}
	};

	/**
	 * Delete user with Google token verification (for Google auth users)
	 */
	deleteUserWithGoogle = async (req: Request, res: Response): Promise<void> => {
		try {
			const { uid } = req.params;
			const { idToken } = req.body;

			if (!idToken) {
				sendError(res, "Google ID token is required", 400);
				return;
			}

			const deleted = await this.userService.deleteUserWithGoogle(uid, idToken);
			if (deleted) {
				sendSuccess(res, null, 200, "User deleted successfully");
			} else {
				sendError(res, "Failed to delete user", 500);
			}
		} catch (error: any) {
			const statusCode = error.statusCode || 500;
			sendError(res, error.message || "Internal server error", statusCode);
		}
	};
}
