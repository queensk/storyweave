import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    const story = await prisma.story.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(story);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating story" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await prisma.story.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Story deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting story" },
      { status: 500 }
    );
  }
}
