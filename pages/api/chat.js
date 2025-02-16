import { OpenAI } from "openai";

const api = new OpenAI({
  baseURL: "https://api.aimlapi.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const result = await api.chat.completions.create({
      model: "deepseek/deepseek-r1",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant who knows everything.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const response = result.choices[0].message.content;

    return res.status(200).json({ response });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error processing your request" });
  }
}
