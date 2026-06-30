import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({

    alert_type: {

        type: String,

        required: true

    },

    severity: {

        type: String,

        enum: [
            "low",
            "medium",
            "high",
            "critical"
        ],

        required: true

    },

    source_ip: {

        type: String,

        default: null

    },

    username: {

        type: String,

        default: null

    },

    mitre_technique: {

        type: String,

        required: true

    },

    confidence: {

        type: Number,

        required: true

    },

    recommendation: {

        type: String,

        required: true

    },

    status: {

        type: String,

        enum: [
            "open",
            "investigating",
            "resolved"
        ],

        default: "open"

    },

    generatedAt: {

        type: Date,

        default: Date.now

    }

});

const Alert =
    mongoose.model("Alert", alertSchema);

export default Alert;