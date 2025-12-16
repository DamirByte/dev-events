import mongoose from "mongoose";

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global type augmentation for cached mongoose connection
 * This prevents TypeScript errors when accessing global.mongoose
 */
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
    // simple flag to avoid race when multiple callers create a connection promise
    creating?: boolean;
  };
}

/**
 * Cached mongoose connection object
 * In development, Next.js hot reloading can cause multiple connections
 * This cache ensures we reuse the existing connection
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, creating: false };
}

/**
 * Create or retrieve a cached Mongoose connection to MongoDB.
 *
 * Uses a module-level cache to avoid opening multiple connections; if a connection
 * is currently being established, waits for that operation to complete before returning.
 *
 * @returns The active Mongoose connection
 */
async function connectDB(): Promise<mongoose.Connection> {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If connection promise doesn't exist, create a new one
  // Lightweight lock: if another caller is currently creating the promise,
  // wait until they set `cached.promise`. Otherwise, set `cached.creating`
  // and create/assign `cached.promise` ourselves.
  while (cached.creating) {
    // small delay to yield to the creator
    await new Promise((r) => setTimeout(r, 5));
  }

  if (!cached.promise) {
    cached.creating = true;
    try {
      const opts = {
        bufferCommands: false, // Disable command buffering
      };

      // assign the promise immediately so other callers can await it
      cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
        return mongoose.connection;
      });
    } finally {
      // release the lock; if the promise rejects, downstream catch will reset it
      cached.creating = false;
    }
  }

  try {
    // Wait for the connection promise to resolve
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error to allow retry
    cached.promise = null;
    // ensure lock is not stuck
    cached.creating = false;
    throw error;
  }

  return cached.conn;
}

export default connectDB;