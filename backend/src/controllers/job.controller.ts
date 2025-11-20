import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { generateJobQuery } from "../utils/generateJobQuery";
import { fetchJobsFromAPI } from "../services/jobService";
import { saveJobToDB } from "../services/jobStoreService";
import { filterJobsBySkills } from "../utils/skillMatcher";

export const getRecommendedJobs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user;

    // 1️⃣ Fetch latest resume
    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!resume)
      return res
        .status(400)
        .json({ success: false, message: "Upload resume first" });

    const skills = (resume.data as any)?.skills || [];

    //@ts-ignore
    const experience = resume.data?.experience?.length || 0;

    if (!Array.isArray(skills) || skills.length === 0)
      return res.status(400).json({
        success: false,
        message: "No skills found in resume",
      });

    // 2️⃣ Preferences from frontend
    const getString = (value: any): string | undefined => {
      if (Array.isArray(value)) return value[0]?.toString();
      if (typeof value === "string") return value;
      if (value === undefined || value === null) return undefined;
      return value.toString();
    };

    const prefs = {
      skills,
      experience,
      city: getString(req.query.city),
      country: getString(req.query.country) || "in",
      role: getString(req.query.role),
      remote: getString(req.query.remote) === "true",
      employmentType: getString(req.query.type)?.split(","),
    };

    // 3️⃣ Generate AI-powered job query
    const aiQuery = await generateJobQuery(prefs);
    console.log("AI Generated Query →", aiQuery);

    // 4️⃣ Fetch jobs from API using AI query
    const apiJobs = await fetchJobsFromAPI(aiQuery, 1, prefs);

    if (!apiJobs || apiJobs.length === 0)
      return res.json({
        success: true,
        query: aiQuery,
        jobs: [],
        message: "No jobs found",
      });

    console.log("Fetched jobs:", apiJobs.length);

    // 5️⃣ Save jobs to DB with expiry
    for (const job of apiJobs) {
      await saveJobToDB(job);
    }

    // 6️⃣ Get fresh (non-expired) jobs
    const freshJobs = await prisma.job.findMany({
      where: { expiresAt: { gt: new Date() } },
      orderBy: { jobPostedAtTimestamp: "desc" },
    });

    // 7️⃣ Format DB jobs to match API structure
    const formattedJobs = freshJobs.map((job: any) => ({
      job_title: job.jobTitle,
      employer_name: job.employerName,
      job_description: job.jobDescription,
      job_highlights: job.jobHighlights,
      ...job,
    }));

    // 8️⃣ Skill matching
    const rankedJobs = filterJobsBySkills(formattedJobs, skills).sort(
      (a, b) => b.matchScore - a.matchScore
    );

    return res.status(200).json({
      success: true,
      query: aiQuery,
      total: rankedJobs.length,
      jobs: rankedJobs,
    });
  } catch (error) {
    console.error("Job Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
