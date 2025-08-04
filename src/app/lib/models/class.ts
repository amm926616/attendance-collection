// src/app/lib/models/class.ts
import mongoose, { Schema, model, models } from "mongoose";

interface ClassDoc extends mongoose.Document {
  name: string; // class ID like math101
}

const ClassSchema = new Schema<ClassDoc>({
  name: { type: String, required: true, unique: true },
});

const ClassModel = models.Class || model<ClassDoc>("Class", ClassSchema);

export default ClassModel;
