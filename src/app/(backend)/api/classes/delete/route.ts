import { connectToDatabase } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose, { Schema, model, models } from "mongoose";

const ADMIN_SECRET = process.env.ADMIN_PASSWORD || "changeme";

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
  const { classId, password } = await req.json();

  if (password !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!classId || typeof classId !== "string") {
    return NextResponse.json({ error: "Invalid classId" }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const result = await Checkin.deleteMany({ classId });
    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to delete records ${err}` },
      { status: 500 },
    );
  }
}
