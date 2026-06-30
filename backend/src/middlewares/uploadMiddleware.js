import multer from "multer";

import path from "path";


// =========================
// STORAGE CONFIGURATION
// =========================

const storage = multer.diskStorage({

    // Destination Folder
    destination: (req, file, cb) => {

        cb(null, "uploads/raw-logs");

    },

    // Unique Filename
    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);

    }

});


// =========================
// FILE VALIDATION
// =========================

const fileFilter = (req, file, cb) => {

    const allowedExtensions = [
        ".log",
        ".txt"
    ];

    const extension =
        path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {

        cb(null, true);

    } else {

        cb(new Error("Only .log and .txt files are allowed"));

    }

};


// =========================
// MULTER CONFIG
// =========================

const upload = multer({

    storage,
    fileFilter,

    limits: {

        fileSize: 10 * 1024 * 1024

    }

});

export default upload;