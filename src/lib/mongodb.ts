import { MongoClient, Db } from 'mongodb';

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://nicesachin2000_db_user:sachin2005@cluster0.qzleweq.mongodb.net/bricks2wall?retryWrites=true&w=majority';

const options = {
  serverSelectionTimeoutMS: 2000,
  connectTimeoutMS: 2000,
  socketTimeoutMS: 3000,
  maxPoolSize: 10,
};

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientInstance: MongoClient | undefined;
}

/**
 * Returns a connected MongoDB database instance for 'bricks2wall'.
 * Caches the MongoClient instance with a strict 2-second timeout to prevent request blocking.
 */
export async function getDb(dbName: string = 'bricks2wall'): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  if (!uri) {
    throw new Error('MONGODB_URI is not configured in environment variables.');
  }

  if (process.env.NODE_ENV === 'development' && global._mongoClientInstance) {
    cachedClient = global._mongoClientInstance;
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, options);
    if (process.env.NODE_ENV === 'development') {
      global._mongoClientInstance = cachedClient;
    }
  }

  const connectPromise = cachedClient.connect();
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('MongoDB connection timeout (2s)')), 2000)
  );

  try {
    const connectedClient = await Promise.race([connectPromise, timeoutPromise]);
    cachedDb = connectedClient.db(dbName);
    return cachedDb;
  } catch (err: any) {
    console.warn('MongoDB getDb warning (falling back gracefully):', err?.message || err);
    // Reset so subsequent requests can retry
    cachedClient = null;
    cachedDb = null;
    if (process.env.NODE_ENV === 'development') {
      global._mongoClientInstance = undefined;
    }
    throw err;
  }
}

export { cachedClient as clientPromise };
