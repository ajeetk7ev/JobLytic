import express from "express";
import { getRecommendedJobs, searchJobs } from "../controllers/job.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/recommend", authMiddleware, getRecommendedJobs);
router.get("/search", authMiddleware, searchJobs);

export default router;
