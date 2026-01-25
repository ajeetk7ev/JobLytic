import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} from "../controllers/jobApplication.controller";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createApplication);
router.get("/", getApplications);
router.patch("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
