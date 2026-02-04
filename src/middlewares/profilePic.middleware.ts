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
        const uid = req.params.uid;
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

// Multer upload instance for profile pictures
export const uploadProfilePic = multer({
    storage: profilePicStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
