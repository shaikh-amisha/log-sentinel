import express from "express";
import upload from "../middlewares/uploadMiddleware.js"
import {
    uploadLogFile
} from "../controllers/logController.js";


const router = express.Router();

// TEST ROUTE

router.get("/", (req, res) => {

    res.json({

        success: true,

        message: "LogSentinel Backend Running"

    });

});


// LOG FILE UPLOAD

router.post(

    "/upload",

    upload.single("logFile"),

    uploadLogFile

);


export default router;