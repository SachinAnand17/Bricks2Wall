const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://nicesachin2000_db_user:sachin2005@cluster0.qzleweq.mongodb.net/bricks2wall?retryWrites=true&w=majority';
const options = {};

let client;
let clientPromise;

if (!uri) {
  console.warn('Warning: MONGODB_URI is not defined.');
} else {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        console.warn('MongoDB connection failed during initialization:', err.message);
        global._mongoClientPromise = null;
        throw err;
      });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect().catch((err) => {
      console.warn('MongoDB connection failed:', err.message);
      throw err;
    });
  }
}

/**
 * Returns a connected MongoDB database instance for 'bricks2wall'.
 * Caches the MongoClient instance across serverless invocations.
 */
async function getDb(dbName = 'bricks2wall') {
  if (!clientPromise) {
    if (!uri) {
      throw new Error('MONGODB_URI is not configured in environment variables.');
    }
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

module.exports = {
  getDb,
  clientPromise,
};
