import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not defined. Please add MONGODB_URI to your .env.local file.'
    );
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('✅ MongoDB connected successfully');
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }

  return cached!.conn;
}

/**
 * Returns connection diagnostic status without throwing
 */
export async function getDbStatus(): Promise<{
  connected: boolean;
  state: string;
  hasUri: boolean;
}> {
  const hasUri = !!process.env.MONGODB_URI;
  if (!hasUri) {
    return { connected: false, state: 'NO_URI_CONFIGURED', hasUri: false };
  }

  const readyState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

  if (readyState === 1) {
    return { connected: true, state: 'Connected', hasUri: true };
  }

  try {
    await connectToDatabase();
    return { connected: true, state: 'Connected', hasUri: true };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return {
      connected: false,
      state: errorObj.message || states[readyState] || 'Disconnected',
      hasUri: true,
    };
  }
}
