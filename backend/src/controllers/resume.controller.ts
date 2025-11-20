
import { extractResumePdfText } from "../utils/extractPdfText";
import { convertResumeToStructuredData } from "../utils/geminiExtractor";
import { Request, Response } from "express";
import {prisma} from '../config/prisma'

export const uploadResume = async (req:Request, res:Response) => {
  try {
    const uploadedFile = (req as any).file;
    const userId = (req as any).user;

    if (!uploadedFile) {
      return res.status(400).json({success:false, message: "No file uploaded" });
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

    return res.status(201).json({
      success:true,
      message: "Resume uploaded & processed successfully",    
      resume,
    });

  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({success:false, message: "Internal Server Error" });
  }
};
