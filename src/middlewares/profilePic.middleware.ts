import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the profilePic directory exists
const uploadDir = path.join(process.cwd(), "public", "profilePic");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for profile pictures
const profilePicStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, _file, cb) => {
        const uid = req.params.uid || req.params.id; // Support both route parameter names
        const ext = path.extname(_file.originalname).toLowerCase();
        // Validate extension
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            return cb(new Error("Only .jpg, .jpeg, and .png files are allowed"), "");
        }
        cb(null, `pp-${uid}${ext}`);
    },
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
    storage: profilePicStorage,
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
