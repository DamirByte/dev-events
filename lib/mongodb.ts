import mongoose from 'mongoose';

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global type augmentation for cached mongoose connection
 * This prevents TypeScript errors when accessing global.mongoose
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

/**
 * Cached mongoose connection object
 * In development, Next.js hot reloading can cause multiple connections
 * This cache ensures we reuse the existing connection
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes and returns a MongoDB connection using Mongoose
 * Implements connection caching to prevent multiple connections in development
 * 
 * @returns {Promise<mongoose.Connection>} The active MongoDB connection
 */
async function connectDB(): Promise<mongoose.Connection> {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If connection promise doesn't exist, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    // Wait for the connection promise to resolve
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
