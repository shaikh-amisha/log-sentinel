import express from "express";
import {
    getAttackGraph
} from "../controllers/graphController.js";

const router =
    express.Router();

router.get(
    "/",
    getAttackGraph
);

export default router;