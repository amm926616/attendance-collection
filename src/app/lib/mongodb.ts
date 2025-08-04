import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define a custom type for the global object
declare global {
  var mongoose: MongooseCache;
}

// Use the declared global type instead of 'any'
const cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
      dbName: "attendance_db",
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}
