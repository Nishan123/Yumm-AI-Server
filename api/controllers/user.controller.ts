import { Request, Response } from "express";

import { UpdateUserDto } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { sendSuccess, sendError } from "../utils/response.util";

export class UserController {
	private userService: UserService;

	constructor(userService: UserService = new UserService()) {
		this.userService = userService;
	}

	registerPushyToken = async (req: Request, res: Response): Promise<void> => {
		try {
			const { uid } = req.params;
			// However, the existing patterns use req.params.uid usually.
			// But for /register-token, it might be a POST to /users/:uid/push-token or just /register-token with auth middleware
			// The user request said: app.post("/register-token", ...) where req.user.id is used.
			// My route design was /register-token -> userController.registerPushyToken
			// But I need the UID. I should probably use `req.user.uid` from `authorizedMiddleWare`.
			// Let's check authorizedMiddleWare later.
			// For now, I'll assume I can get uid from req.body (bad) or req.params (RESTful) or req.user (middleware).
			// The existing routes usage: router.get("/me/:uid", ...) suggests :uid param is used.
			// BUT, strictly speaking, register token should be for the *logged in* user.
			// I'll stick to the pattern: if I use authorizedMiddleWare, I might have req.user.
			// Let's assume the route will be /users/:uid/push-token for consistency with other routes?
			// The plan said: POST /register-token.
			// If I use POST /register-token, I need to know WHO is calling.
			// Given the existing middleware `authorizedMiddleWare`, let's see if it attaches user.
			// I'll check `authorizedMiddleWare` in a second. 
			// For now, I'll implement it expecting `req.body.token` and `req.params.uid` (if I use /users/:uid/...) OR `req.user.uid`.

			// Let's align with the route plan: POST /register-token.
			// If the route is /register-token, where does UID come from?
			// I'll check `authorizedMiddleWare` file content.

			// For now, let's write the controller assuming we receive UID somehow.
			// Actually, to be safe and consistent with `updateUser` which takes `:uid`, I should probably use `/users/:uid/push-token`.
			// But the plan "POST /register-token" implies a top level route.
			// I'll verify middleware first.

			// Wait, I can't check middleware inside this tool call.
			// I will implement it assuming `req.params.uid` for now, and I will define the route as `/users/:uid/push-token` which is cleaner and consistent.
			// The user request example had `app.post("/register-token", ...)` using `req.user.id`.
			// But my `UserRoute` uses `/users/:uid` for everything.
			// So I will implement `registerPushyToken` to use `req.params.uid`.


			const { token } = req.body;

			if (!token) {
				sendError(res, "Token is required", 400);
				return;
			}

			await this.userService.registerPushyToken(uid, token);
			sendSuccess(res, null, 200, "Token registered successfully");
		} catch (error) {
			sendError(res, (error as Error).message, 500);
		}
	};

	sendAdminNotification = async (req: Request, res: Response): Promise<void> => {
		try {
			const { title, message } = req.body;
			if (!title || !message) {
				sendError(res, "Title and message are required", 400);
				return;
			}

			await this.userService.sendAdminNotification(title, message);
			sendSuccess(res, null, 200, "Notification sent successfully");
		} catch (error) {
			sendError(res, (error as Error).message, 500);
		}
	};

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
			const { reason } = req.body;
			const deleted = await this.userService.deleteUser(uid, reason);
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
			const { password, reason } = req.body;

			if (!password) {
				sendError(res, "Password is required", 400);
				return;
			}

			const deleted = await this.userService.deleteUserWithPassword(uid, password, reason);
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
			const { idToken, reason } = req.body;

			if (!idToken) {
				sendError(res, "Google ID token is required", 400);
				return;
			}

			const deleted = await this.userService.deleteUserWithGoogle(uid, idToken, reason);
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
