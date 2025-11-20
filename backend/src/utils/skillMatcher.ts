export const filterJobsBySkills = (jobs: any[], skills: string[]) => {
  const lowercaseSkills = skills.map((s) => s.toLowerCase());

  return jobs.map((job) => {
    const text = (
      job.job_title +
      " " +
      job.job_description +
      " " +
      job.job_highlights
    ).toLowerCase();

    const matchedSkills = lowercaseSkills.filter((skill) =>
      text.includes(skill)
    );

    const matchScore = Math.round(
      (matchedSkills.length / lowercaseSkills.length) * 100
    );

    return {
      ...job,
      matchedSkills,
      matchScore,
    };
  });
};
