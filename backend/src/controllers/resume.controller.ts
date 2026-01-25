import { extractResumePdfText } from "../utils/extractPdfText";
import { convertResumeToStructuredData } from "../utils/geminiExtractor";
import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import redisClient from "../config/redis";
import { callOpenRouter } from "../utils/openRouterService";

export const uploadResume = async (req: Request, res: Response) => {
  try {
    const uploadedFile = (req as any).file;
    const userId = (req as any).id;

    if (!uploadedFile) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Convert buffer to File object for pdf2json
    const file = new File([uploadedFile.buffer], uploadedFile.originalname);

    // 1️⃣ Extract raw text from PDF
    const rawText = await extractResumePdfText(file);

    // 2️⃣ Convert to structured JSON via Gemini AI
    const structuredData = await convertResumeToStructuredData(rawText);

    // 3️⃣ Save in DB
    const resume = await prisma.resume.create({
      data: {
        userId,
        rawText,
        data: structuredData,
      },
    });

    await redisClient.del(`jobs:${userId}`);

    return res.status(201).json({
      success: true,
      message: "Resume uploaded & processed successfully",
      resume,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const matchResumeWithJD = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const { jobDescription, resumeId } = req.body;

    if (!jobDescription) {
      return res
        .status(400)
        .json({ success: false, message: "Job Description is required" });
    }

    // Fetch Resume
    let resumeText = "";
    if (resumeId) {
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
      });
      if (!resume)
        return res
          .status(404)
          .json({ success: false, message: "Resume not found" });
      resumeText = resume.rawText || JSON.stringify(resume.data);
    } else {
      // Default to latest
      const resume = await prisma.resume.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      if (!resume)
        return res.status(400).json({
          success: false,
          message: "No resume found. Please upload one first.",
        });
      resumeText = resume.rawText || JSON.stringify(resume.data);
    }

    // AI Analysis
    const prompt = `
      You are an expert ATS (Applicant Tracking System) Analyzer. Compare the following Resume and Job Description.

      RESUME:
      ${resumeText.slice(0, 3000)}

      JOB DESCRIPTION:
      ${jobDescription.slice(0, 3000)}

      Analyze the match compatibility.
      Return ONLY a JSON object with this exact structure (no markdown, no explanations):
      {
        "score": number, // 0-100
        "missingKeywords": string[], // Critical skills/keywords missing in resume
        "matchingKeywords": string[], // Key skills found
        "strengths": string[], // What matches well
        "weaknesses": string[], // Gaps or weak areas
        "recommendation": string // 1-2 sentences advice
      }
    `;

    const aiResponse = await callOpenRouter(prompt);

    // Parse JSON
    let analysis;
    try {
      const cleanJson = aiResponse.replace(/```json|```/g, "").trim();
      analysis = JSON.parse(cleanJson);
    } catch (e) {
      console.error("AI Parse Error", e);
      // Fallback
      analysis = {
        score: 50,
        missingKeywords: [],
        matchingKeywords: [],
        strengths: ["Unable to parse detailed analysis"],
        weaknesses: [],
        recommendation: "Please try again.",
      };
    }

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("JD Match Error:", error);
    return res.status(500).json({ success: false, message: "Analysis failed" });
  }
};
