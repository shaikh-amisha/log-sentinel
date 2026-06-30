import express from "express";

import {

    getDashboardStats,

    getSeverityChart,

    getMitreHeatmap,

    getRecentAlerts,

    getAlertVolume

} from "../controllers/dashboardController.js";

const router = express.Router();


// =========================
// DASHBOARD STATS
// =========================

router.get("/stats", getDashboardStats);


// =========================
// SEVERITY CHART
// =========================

router.get("/severity", getSeverityChart);


// =========================
// MITRE HEATMAP
// =========================

router.get("/mitre", getMitreHeatmap);


// =========================
// RECENT ALERTS
// =========================

router.get("/recent", getRecentAlerts);


// ALERT VOLUME
router.get( "/alert-volume", getAlertVolume);



export default router;

