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
You are an AI career expert. Your job is to analyze the user's skills and preferences, determine the most likely job roles for them, and generate 5 natural-language job search queries compatible with the JSearch RapidAPI.

-----------------------------------
### 1. Analyze the User's Skills
Based on the skills, identify the most suitable job categories such as (but not limited to):

- Software Developer (frontend, backend, full stack)
- Mobile Developer (React Native, Flutter)
- Data Analyst (Excel, SQL, Python, Power BI)
- Data Scientist / ML Engineer
- Cloud / DevOps Engineer
- Cybersecurity Analyst
- UI/UX Designer
- Database Administrator
- AI Engineer
- Business Analyst
- Digital Marketing
- HR / Recruitment
- Finance / Accounting
- Project Manager
- Content Writer, SEO Specialist, Graphic Designer
- Any non-tech domain if skills match

Determine the **top 1–3 possible job roles** based on skills.  
If the user is non-tech, respond with non-tech roles accordingly.

-----------------------------------
### 2. Generate 5 Natural Job Search Queries
Each query should:
- Be formatted like a REAL human search query  
  Example: "data analyst jobs in india", "react developer remote jobs"
- Include the detected job role
- Include 1–3 relevant skills naturally (not listed unnecessarily)
- Include city or country if provided
- Include "remote jobs" only if remote = true
- Match job board (Google for Jobs / JSearch API) friendly phrasing
- Tailor queries to the experience level

-----------------------------------
### 3. Examples of Good Queries
- "react frontend developer jobs in bangalore with typescript"
- "data analyst jobs in india with excel and sql"
- "python backend developer remote jobs"
- "digital marketing jobs in delhi for freshers"
- "business analyst jobs in usa with tableau"
- "full stack developer jobs in canada using node and react"

-----------------------------------
### 4. Strict Output Rules
- Return ONLY 5 queries
- Each query on a new line
- No numbering
- No markdown
- No explanations
- No quotes

-----------------------------------
### User Preferences:
${JSON.stringify(prefs, null, 2)}

Now return 5 natural job search queries only.
`;

  let query = await callOpenRouter(prompt);
  query = query.trim();

  // Remove accidental markdown / quotes
  query = query.replace(/```/g, "").replace(/^"|"$/g, "");

  return query;
};
