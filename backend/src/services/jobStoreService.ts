import {prisma} from '../config/prisma'

export const saveJobToDB = async (job: any) => {
  const expireTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  try {
    const existing = await prisma.job.findUnique({
      where: { jobId: job.job_id }
    });

    if (existing) return existing; // avoid duplicates

    const newJob = await prisma.job.create({
      data: {
        jobId: job.job_id,
        jobTitle: job.job_title,
        employerName: job.employer_name,
        employerLogo: job.employer_logo,
        employerWebsite: job.employer_website,
        jobPublisher: job.job_publisher,
        jobEmploymentType: job.job_employment_type,
        jobEmploymentTypes: job.job_employment_types,
        jobApplyLink: job.job_apply_link,
        applyOptions: job.apply_options,
        jobDescription: job.job_description,
        jobIsRemote: job.job_is_remote,

        jobPostedAt: job.job_posted_at,
        jobPostedAtTimestamp: job.job_posted_at_timestamp,
        jobPostedAtUTC: job.job_posted_at_datetime_utc
          ? new Date(job.job_posted_at_datetime_utc)
          : null,

        jobLocation: job.job_location,
        jobCity: job.job_city,
        jobState: job.job_state,
        jobCountry: job.job_country,
        jobLatitude: job.job_latitude,
        jobLongitude: job.job_longitude,

        jobBenefits: job.job_benefits ?? [],
        jobGoogleLink: job.job_google_link,
        jobMinSalary: job.job_min_salary,
        jobMaxSalary: job.job_max_salary,
        jobSalaryPeriod: job.job_salary_period,
        jobHighlights: job.job_highlights,

        jobOnetSoc: job.job_onet_soc,
        jobOnetJobZone: job.job_onet_job_zone,

        expiresAt: expireTime,
      }
    });

    return newJob;

  } catch (error) {
    console.error("Job DB Save Error:", error);
    return null;
  }
};
