import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import mongoose, { Schema, model, models } from "mongoose";

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

export async function GET() {
  await connectToDatabase();

  const checkins = await Checkin.find().sort({ timestamp: -1 }).lean();

  return NextResponse.json({ checkins });
}
