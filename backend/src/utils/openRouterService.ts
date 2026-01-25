import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "meta-llama/llama-3.1-8b-instruct:free";

export const callOpenRouter = async (prompt: string) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not defined in environment variables",
    );
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
          "X-Title": "Joblytic", // Required by OpenRouter
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error(
      "OpenRouter API Error:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to get response from AI service");
  }
};
