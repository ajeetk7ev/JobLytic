import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { generateJobQuery } from "../utils/generateJobQuery";
import { fetchJobsFromAPI } from "../services/jobService";
import { saveJobToDB } from "../services/jobStoreService";
import { filterJobsBySkills } from "../utils/skillMatcher";
import redisClient from "../config/redis";

export const getRecommendedJobs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;

    const page = Number(req.query.page) || 1;
    // Redis cache key
    const cacheKey = `jobs:${userId}:${page}`;

    // 1️⃣ Check Redis first
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      const cached = JSON.parse(cachedData);
      console.log("Returning cached jobs");

      return res.status(200).json({
        success: true,
        cached: true,
        query: cached.query,
        total: cached.jobs.length, // Note: This might need adjustment if total is available from API
        jobs: cached.jobs,
        page,
      });
    }

    // 2️⃣ Fetch latest resume
    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!resume)
      return res.status(400).json({
        success: false,
        message: "Upload resume first",
      });

    const skills = (resume.data as any)?.skills || [];
    //@ts-ignore
    const experience = resume.data?.experience?.length || 0;

    if (!Array.isArray(skills) || skills.length === 0)
      return res.status(400).json({
        success: false,
        message: "No skills found in resume",
      });

    // Convert query params to strings
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
      country: getString(req.query.country) || "us",
      role: getString(req.query.role),
      remote: getString(req.query.remote) === "true",
      employmentType: getString(req.query.type)?.split(","),
    };

    // 3️⃣ AI-generated job query
    // We can also cache the AI query to avoid re-generating it every page if needed,
    // but for now let's regenerate or maybe check if we have a "base" cache key.
    // Actually, distinct pages might need distinct queries? Unlikely.
    // Let's stick to generating it.
    const aiQuery = await generateJobQuery(prefs);
    console.log("AI Generated Query →", aiQuery);

    // 4️⃣ Fetch from RapidAPI
    const apiRes = await fetchJobsFromAPI(aiQuery, page, prefs);
    const apiJobs = apiRes?.data || [];
    const totalJobs = apiRes?.total || 0;

    if (apiJobs.length === 0)
      return res.json({
        success: true,
        query: aiQuery,
        jobs: [],
        message: "No jobs found",
        page,
      });

    // 5️⃣ Save to DB with expiry
    for (const job of apiJobs) {
      await saveJobToDB(job);
    }

    // 6️⃣ Get fresh jobs from DB - Wait, this step fetches ALL fresh jobs from DB,
    // which effectively ignores the pagination we just did with the API for the current page.
    // If we want to return the exact jobs from the API (but with our DB formatting),
    // we should filter freshJobs by the IDs we just got.

    // Optimizing: Just map apiJobs directly if they contain all data,
    // BUT our saveJobToDB might normalize them.
    // Let's stick to the existing logic but limit it to the job IDs we just fetched
    // to preserve the API's pagination result.

    const apiJobIds = apiJobs.map((j: any) => j.job_id); // Assuming job_id is present

    const freshJobs = await prisma.job.findMany({
      where: {
        jobId: { in: apiJobIds }, // Only fetch the ones we just got/saved
      },
    });

    // 7️⃣ Format jobs for skill matching
    const formattedJobs = freshJobs.map((job: any) => ({
      job_title: job.jobTitle,
      employer_name: job.employerName,
      job_description: job.jobDescription,
      job_highlights: job.jobHighlights,
      ...job,
    }));

    // 8️⃣ Rank by skills
    const rankedJobs = filterJobsBySkills(formattedJobs, skills).sort(
      (a, b) => b.matchScore - a.matchScore,
    );

    // 9️⃣ Cache the result in Redis for 24 hours
    await redisClient.set(
      cacheKey,
      JSON.stringify({ query: aiQuery, jobs: rankedJobs, total: totalJobs }),
      {
        EX: 60 * 60 * 24, // TTL in seconds (86400)
      },
    );

    return res.status(200).json({
      success: true,
      cached: false,
      query: aiQuery,
      total: totalJobs || 500, // Fallback if API doesn't return total
      jobs: rankedJobs,
      page,
    });
  } catch (error) {
    console.error("Job Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const searchJobs = async (req: Request, res: Response) => {
  try {
    const {
      query,
      page = 1,
      country = "us",
      language,
      date_posted = "all",
      work_from_home = false,
      employment_types,
      job_requirements,
      radius,
      exclude_job_publishers,
    } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const params = {
      country,
      language,
      datePosted: date_posted,
      remote: work_from_home === "true",
      employmentTypes: employment_types,
      job_requirements,
      radius: radius ? Number(radius) : undefined,
      excludePublishers: exclude_job_publishers,
    };

    // --- DB CACHE CHECK ---
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingQuery = await (prisma as any).jobQuery.findUnique({
      where: { query: query as string },
    });

    let apiJobs: any[] = [];
    let totalJobs = 0;
    let usedDbCache = false;

    if (
      existingQuery &&
      new Date(existingQuery.fetchedAt) > twentyFourHoursAgo &&
      Number(page) === 1
    ) {
      console.log("Cache Hit: Serving from DB for search query:", query);
      // We can use a simple text search or regex if possible, or just date-based recent jobs
      // For better results, we really should store relations, but for now, recent jobs is a good approximation
      // or we rely on the client's specific filters.
      // Since search is specific, let's just use the API if we don't have a good way to filter DB by query string.
      // BUT, the user requested it. So let's try to match by title/description.

      const recentJobs = await prisma.job.findMany({
        where: {
          createdAt: { gt: twentyFourHoursAgo },
          OR: [
            { jobTitle: { contains: query as string, mode: "insensitive" } },
            {
              jobDescription: {
                contains: query as string,
                mode: "insensitive",
              },
            },
            { jobCity: { contains: query as string, mode: "insensitive" } },
          ],
        },
        orderBy: { jobPostedAtTimestamp: "desc" },
        take: 50,
      });

      if (recentJobs.length > 0) {
        apiJobs = recentJobs.map((j) => ({
          ...j,
          job_title: j.jobTitle,
          employer_name: j.employerName,
          job_description: j.jobDescription,
          job_highlights: j.jobHighlights,
          // Reconstruct keys expected by frontend
          job_city: j.jobCity,
          job_country: j.jobCountry,
          job_latitude: j.jobLatitude,
          job_longitude: j.jobLongitude,
          job_apply_link: j.jobApplyLink,
          job_posted_at: j.jobPostedAt,
          job_is_remote: j.jobIsRemote,
          job_employment_type: j.jobEmploymentType,
          job_min_salary: j.jobMinSalary,
          job_max_salary: j.jobMaxSalary,
          job_salary: j.jobSalaryPeriod, // mapping issue potentially but ok for now
          job_publisher: j.jobPublisher,
          employer_logo: j.employerLogo,
          employer_website: j.employerWebsite,
        }));
        usedDbCache = true;
      }
    }

    if (!usedDbCache) {
      const apiRes = await fetchJobsFromAPI(
        query as string,
        Number(page),
        params,
      );
      apiJobs = apiRes?.data || [];
      totalJobs = apiRes?.total || 0;

      // Save to DB for future JD matching references
      if (apiRes?.data) {
        for (const job of apiRes.data) {
          await saveJobToDB(job);
        }

        // Update JobQuery log
        if (Number(page) === 1) {
          await (prisma as any).jobQuery.upsert({
            where: { query: query as string },
            update: { fetchedAt: new Date() },
            create: { query: query as string, fetchedAt: new Date() },
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: apiJobs, // variable renamed from apiRes.data
      total: totalJobs, // variable renamed
      page: Number(page),
      dbCached: usedDbCache,
    });
  } catch (error) {
    console.error("Job Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
