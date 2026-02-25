import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config";

// Configure Cloudinary storage for profile pictures
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "YummAI/ProfilePics",
        allowed_formats: ["jpg", "jpeg", "png"],
    } as any,
});

// File filter to only allow images
const imageFileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG and PNG images are allowed"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

export const uploadProfilePic = (req: any, res: any, next: any) => {
    upload.single("profilePic")(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "File is too large. Maximum size is 5MB.",
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "An unknown error occurred during file upload.",
            });
        }
        next();
    });
};
