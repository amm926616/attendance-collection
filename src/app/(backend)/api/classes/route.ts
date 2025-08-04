// src/app/api/classes/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import ClassModel from "@/app/lib/models/class";

export async function GET() {
  await connectToDatabase();
  const classes = await ClassModel.find({}, { _id: 0, name: 1 }).lean();
  return NextResponse.json({ classes });
}

export async function POST(req: Request) {
  await connectToDatabase();

  const { name } = await req.json();

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Invalid class name" }, { status: 400 });
  }

  // Optional: validate class name format (alphanumeric, dashes, no spaces)
  const validName = /^[a-zA-Z0-9\-]+$/.test(name);
  if (!validName) {
    return NextResponse.json(
      { error: "Class name must be alphanumeric or dashes only" },
      { status: 400 },
    );
  }

  const exists = await ClassModel.findOne({ name });
  if (exists) {
    return NextResponse.json(
      { error: "Class name already exists" },
      { status: 400 },
    );
  }

  const newClass = await ClassModel.create({ name });

  return NextResponse.json({ success: true, newClass });
}
