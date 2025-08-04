// src/app/api/checkin/route.ts

import { NextResponse } from "next/server";
import mongoose, { Schema, model, models } from "mongoose";
import { connectToDatabase } from "@/app/lib/mongodb";

interface CheckinDoc extends mongoose.Document {
  name: string;
  classId: string;
  timestamp: Date;
}

const CheckinSchema = new Schema<CheckinDoc>({
  name: { type: String, required: true },
  classId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Checkin = models.Checkin || model<CheckinDoc>("Checkin", CheckinSchema);

export async function POST(req: Request) {
  const { name, classId } = await req.json();

  if (!name || !classId) {
    return NextResponse.json(
      { error: "Missing name or classId" },
      { status: 400 },
    );
  }

  await connectToDatabase();

  const result = await Checkin.create({ name, classId });

  return NextResponse.json({ success: true, result }, { status: 200 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const classId = searchParams.get("classId");

  if (!name || !classId) {
    return NextResponse.json(
      { error: "Missing name or classId" },
      { status: 400 },
    );
  }

  await connectToDatabase();

  // Check if the user has already checked in to this class
  const exists = await Checkin.exists({ name, classId });

  return NextResponse.json({ checkedIn: Boolean(exists) }, { status: 200 });
}
