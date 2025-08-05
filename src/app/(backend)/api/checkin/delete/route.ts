import { connectToDatabase } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose, { Schema, model, models } from "mongoose";

// --- Checkin Model ---
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

// --- Class Model ---
interface ClassDoc extends mongoose.Document {
  name: string;
}
const ClassSchema = new Schema<ClassDoc>({
  name: { type: String, required: true, unique: true },
});
const Class = models.Class || model<ClassDoc>("Class", ClassSchema);

export async function POST(req: Request) {
  const { classId } = await req.json();

  if (!classId || typeof classId !== "string") {
    return NextResponse.json({ error: "Invalid classId" }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const deleteCheckins = await Checkin.deleteMany({ classId });
    const deleteClass = await Class.deleteOne({ name: classId });

    return NextResponse.json({
      success: true,
      deletedCheckins: deleteCheckins.deletedCount,
      deletedClassEntry: deleteClass.deletedCount,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete class data", details: err },
      { status: 500 },
    );
  }
}
