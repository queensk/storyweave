import { OpenAI } from "openai";

const api = new OpenAI({
  baseURL: "https://api.aimlapi.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("Method not allowed");
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { title, style } = req.body;

    const prompt = `Create an engaging and creative story with the title "${title}" in the ${style} genre. The story should be captivating, well-structured, and approximately 500 words long. Include vivid descriptions, interesting characters, and an engaging plot.`;

    const result = await api.chat.completions.create({
      model: "deepseek/deepseek-r1",
      messages: [
        {
          role: "system",
          content:
            "You are a creative storyteller who specializes in writing engaging and imaginative stories across various genres.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const story = result.choices[0].message.content;

    return res.status(200).json({
      story,
      title,
      style,
      chapters: 1,
      status: "in-progress",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error generating story" });
  }
}
