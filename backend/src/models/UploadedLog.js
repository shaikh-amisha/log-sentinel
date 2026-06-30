import mongoose from "mongoose";

const uploadedLogSchema = new mongoose.Schema({

    originalName: {

        type: String,

        required: true

    },

    storedName: {

        type: String,

        required: true

    },

    filePath: {

        type: String,

        required: true

    },

    fileSize: {

        type: Number,

        required: true

    },

    logType: {

        type: String,

        default: "unknown"

    },

    processingStatus: {

        type: String,

        enum: [
            "uploaded",
            "processing",
            "processed",
            "failed"
        ],

        default: "uploaded"

    },

    uploadedAt: {

        type: Date,

        default: Date.now

    }

});

const UploadedLog =
    mongoose.model("UploadedLog", uploadedLogSchema);

export default UploadedLog;