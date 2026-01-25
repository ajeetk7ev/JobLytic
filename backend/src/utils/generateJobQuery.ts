import { callOpenRouter } from "./openRouterService";

interface JobPreferences {
  skills: string[];
  experience: number;
  country?: string;
  city?: string;
  role?: string;
  remote?: boolean;
  employmentType?: string[]; // FULLTIME, PARTTIME, INTERN, CONTRACTOR
  expRequirement?: string; // under_3_years_experience, no_experience
}

export const generateJobQuery = async (prefs: JobPreferences) => {
  const prompt = `
You are an AI career expert. Your goal is to generate a SINGLE, highly optimized job search query for the JSearch RapidAPI (Google Jobs).

Analyze the user's profile:
${JSON.stringify(prefs, null, 2)}

### Rules for the Query:
1. **Format**: "[Primary Job Title] jobs in [Location]"
2. **Conciseness**: Keep it under 10 words. Avoid long lists of skills.
3. **Relevance**: Pick the MOST likely job role based on the top skills.
4. **Location**: Use the provided city/country. If missing, default to provided prefs or global.
5. **Output**: Return ONLY the query string. No quotes, no markdown, no explanations.

### Examples of Good Queries:
- "Full Stack Developer jobs in Chicago"
- "React Developer jobs in India"
- "Data Analyst jobs in New York"
- "Python Developer remote jobs"

Generate the best single query now:
`;

  let query = await callOpenRouter(prompt);
  query = query.trim();

  // Remove accidental markdown / quotes
  query = query.replace(/```/g, "").replace(/^"|"$/g, "");

  // Clean up any newlines if the AI ignored instructions
  query = query.split("\n")[0].trim();

  return query;
};
