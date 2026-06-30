import mongoose from "mongoose";

const logEntrySchema = new mongoose.Schema({

    timestamp: {
        type: Date
    },

    message: {
        type: String,
        required: true
    },

    eventType: {
        type: String,
        default: "unknown"
    },

    severity: {
        type: String,
        default: "Low"
    },

    sourceIp: {
        type: String,
        default: "-"
    },

    username: {
        type: String,
        default: "-"
    },

    host: {
        type: String,
        default: "-"
    },

    mitre: {
        type: String,
        default: "-"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

export default mongoose.model(
    "LogEntry",
    logEntrySchema
);