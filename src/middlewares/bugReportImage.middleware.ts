import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the bugReportImages directory exists
const uploadDir = path.join(process.cwd(), "public", "bugReportImages");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for bug report images
const bugReportImageStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, _file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(_file.originalname).toLowerCase();
        // Validate extension
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
            return cb(new Error("Only .jpg, .jpeg, .png and .webp files are allowed"), "");
        }
        cb(null, `bug-${timestamp}-${Math.round(Math.random() * 1E9)}${ext}`);
    },
});

// File filter to only allow images
const imageFileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG and WEBP images are allowed"));
    }
};

// Multer upload instance for bug report images
export const uploadBugReportImageMiddleware = multer({
    storage: bugReportImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
