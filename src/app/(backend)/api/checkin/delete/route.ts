import { connectToDatabase } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const ADMIN_SECRET = process.env.ADMIN_PASSWORD || "changeme";

interface CheckinDoc extends mongoose.Document {
  name: string;
  classId: string;
  timestamp: Date;
}

const CheckinSchema = new mongoose.Schema<CheckinDoc>({
  name: { type: String, required: true },
  classId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Checkin =
  mongoose.models.Checkin ||
  mongoose.model<CheckinDoc>("Checkin", CheckinSchema);

export async function POST(req: Request) {
  const { id, password } = await req.json();

  if (password !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  await connectToDatabase();

  try {
    await Checkin.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to delete, ${err}` },
      { status: 500 },
    );
  }
}
