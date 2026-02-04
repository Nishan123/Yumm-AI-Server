import { Request, Response } from "express";
import fs from "fs";
import path from "path";
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

			// Clean up old profile pictures with different extensions
			const uploadDir = path.join(process.cwd(), "public", "profilePic");
			if (fs.existsSync(uploadDir)) {
				const files = fs.readdirSync(uploadDir);
				files.forEach((file) => {
					// Check if file starts with pp-uid. and is NOT the current new file
					if (file.startsWith(`pp-${uid}.`) && file !== req.file?.filename) {
						try {
							fs.unlinkSync(path.join(uploadDir, file));
							console.log(`Deleted get old profile pic: ${file}`);
						} catch (err) {
							console.error(`Failed to delete old profile pic: ${file}`, err);
						}
					}
				});
			}

			// Construct the profile picture URL
			const port = process.env.PORT || 5000;
			const ext = req.file.filename.split('.').pop();
			const profilePicUrl = `http://localhost:${port}/public/profilePic/pp-${uid}.${ext}`;

			// Update user's profilePic in database
			const updatedUser = await this.userService.updateProfilePic(uid, profilePicUrl);
			if (!updatedUser) {
				sendError(res, "User not found", 404);
				return;
			}

			sendSuccess(res, updatedUser, 200, "Profile picture uploaded successfully");
		} catch (error) {
			sendError(res, (error as Error).message, 500);
		}
	};
}
