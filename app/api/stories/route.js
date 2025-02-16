import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { title, style } = await req.json();

    const prompt = `Create an engaging and creative story with the title "${title}" in the ${style} genre. The story should be captivating, well-structured, and approximately 500 words long.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a creative storyteller who specializes in writing engaging stories.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const generatedContent = completion.choices[0].message.content;

    const story = await prisma.story.create({
      data: {
        title,
        style,
        content: generatedContent || "",
        status: "in-progress",
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error generating story" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      include: {
        comments: true,
      },
      orderBy: {
        dateCreated: "desc",
      },
    });
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching stories" },
      { status: 500 }
    );
  }
}
