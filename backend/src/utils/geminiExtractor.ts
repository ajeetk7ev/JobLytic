import { callOpenRouter } from "./openRouterService";

export const convertResumeToStructuredData = async (rawText: string) => {
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

  let textOutput = await callOpenRouter(prompt);
  textOutput = textOutput.trim();

  // Remove markdown fences like ```json ... ```
  textOutput = textOutput.replace(/^```json|```$/g, "").trim();
  textOutput = textOutput.replace(/^```|```$/g, "").trim();

  // Sometimes AI wraps output in code blocks multiple times
  textOutput = textOutput
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(textOutput);
  } catch (e) {
    console.error("AI invalid JSON:", textOutput);
    throw new Error("AI service returned invalid JSON");
  }
};
