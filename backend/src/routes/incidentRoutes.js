import express from "express";

import {
    generateIncident
} from "../controllers/incidentController.js";

const router =
    express.Router();

router.post(
    "/report",
    generateIncident
);

export default router;