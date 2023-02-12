import { MongoClient } from 'mongodb';
import { env } from 'process';
// import * as dotenv from 'dotenv';

// dotenv.config();

const uri = process.env.MONGODB_URL; // your mongodb connection string
const options = {};

let client;
let clientPromise;

var _mongoClientPromise;

if (!process.env.MONGODB_URL) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
// export default clientPromise;

const getCollection = async (CollectionName) => {
  const client = await clientPromise;

  return client.db().collection(CollectionName);
  // return (await client.connect()).db().collection(CollectionName);
};

export default getCollection;
