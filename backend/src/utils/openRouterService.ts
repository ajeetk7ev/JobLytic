import { OpenRouter } from "@openrouter/sdk";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "meta-llama/llama-3.1-8b-instruct:free";

const openrouter = new OpenRouter({
  apiKey: OPENROUTER_API_KEY,
});

export const callOpenRouter = async (prompt: string) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not defined in environment variables",
    );
  }

  try {
    const response = await openrouter.chat.send({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    // Handle both streaming and non-streaming responses if the SDK returns them differently
    // Usually non-streaming returns the whole object
    return (response as any).choices[0].message.content;
  } catch (error: any) {
    console.error("OpenRouter API Error:", error.message);
    throw new Error("Failed to get response from AI service");
  }
};
