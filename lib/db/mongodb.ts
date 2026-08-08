import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2500, // Fail fast in 2.5s if DB is unreachable (e.g. during deployment build phase)
      connectTimeoutMS: 2500,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        const maskedUri = MONGODB_URI.replace(/:([^:@]{4,})@/, ":***@");
        console.log("Mongoose connected to database:", mongooseInstance.connection.name, "at URI:", maskedUri);
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn("Mongoose connection attempt failed:", err.message);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

export default connectToDatabase;
