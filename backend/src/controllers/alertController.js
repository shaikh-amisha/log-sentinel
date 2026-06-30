import Alert from "../models/Alert.js";


// =========================
// GET ALL ALERTS
// =========================

export const getAllAlerts = async (req, res) => {

    try {

        const alerts =
            await Alert.find()
                .sort({ generatedAt: -1 });

        res.status(200).json({

            success: true,

            count: alerts.length,

            alerts

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =========================
// GET ALERT BY ID
// =========================

export const getAlertById = async (req, res) => {

    try {

        const alert =
            await Alert.findById(req.params.id);

        if (!alert) {

            return res.status(404).json({

                success: false,

                message: "Alert not found"

            });

        }

        res.status(200).json({

            success: true,

            alert

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =========================
// UPDATE ALERT STATUS
// =========================

export const updateAlertStatus = async (req, res) => {

    try {

        const alert =
            await Alert.findById(req.params.id);

        if (!alert) {

            return res.status(404).json({

                success: false,

                message: "Alert not found"

            });

        }

        alert.status =
            req.body.status || alert.status;

        await alert.save();

        res.status(200).json({

            success: true,

            message: "Alert updated",

            alert

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};