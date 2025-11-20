import express from "express";
import { uploadResume } from "../controllers/resume.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../config/multer";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);

export default router;
