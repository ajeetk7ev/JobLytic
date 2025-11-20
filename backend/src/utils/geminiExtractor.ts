import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const convertResumeToStructuredData = async (rawText: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  Extract the following structured data from the resume text:

  {
    "fullName": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "skills": [],
    "experience": [
      {
        "role": "",
        "company": "",
        "duration": "",
        "description": ""
      }
    ],
    "projects": [
      {
        "name": "",
        "tech": [],
        "description": ""
      }
    ],
    "education": [
      {
        "degree": "",
        "institute": "",
        "year": ""
      }
    ],
    "summary": "",
    "certifications": []
  }

  DO NOT include extra text. Return ONLY valid JSON.

  Resume Text:
  """${rawText}"""
  `;

  const result = await model.generateContent(prompt);
  let textOutput = result.response.text().trim();

  // Remove markdown fences like ```json ... ```
  textOutput = textOutput.replace(/^```json|```$/g, "").trim();
  textOutput = textOutput.replace(/^```|```$/g, "").trim();

  // Sometimes Gemini wraps output in code blocks multiple times
  textOutput = textOutput
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(textOutput);
  } catch (e) {
    console.error("Gemini invalid JSON:", textOutput);
    throw new Error("Gemini returned invalid JSON");
  }
};
