import express from "express";
import { getRecommendedJobs } from "../controllers/job.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/recommend", authMiddleware, getRecommendedJobs);

export default router;
