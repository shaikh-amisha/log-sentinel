import express from "express";

import {

    getAllAlerts,

    getAlertById,

    updateAlertStatus

} from "../controllers/alertController.js";

const router = express.Router();


// =========================
// GET ALL ALERTS
// =========================

router.get("/", getAllAlerts);


// =========================
// GET SINGLE ALERT
// =========================

router.get("/:id", getAlertById);


// =========================
// UPDATE ALERT STATUS
// =========================

router.patch("/:id", updateAlertStatus);


export default router;