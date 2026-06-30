import express from "express";
import {
    getInvestigationData
} from "../controllers/investigationController.js";

const router = express.Router();

router.get(
    "/",
    getInvestigationData
);

export default router;