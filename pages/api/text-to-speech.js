// pages/api/text-to-speech.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    const response = await fetch("https://api.aimlapi.com/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        model: "#g1_aura-asteria-en",
        encoding: "linear16",
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return res.status(200).json({
      success: true,
      audioData: `data:audio/wav;base64,${audioBase64}`,
    });
  } catch (error) {
    console.error("Error generating audio:", error);
    return res.status(500).json({ error: "Failed to generate audio" });
  }
}
