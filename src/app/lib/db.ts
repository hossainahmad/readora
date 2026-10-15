import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const isDevelopment = process.env.NODE_ENV === "development";
const client = isDevelopment
  ? (global._mongoClient ??= new MongoClient(uri, options))
  : new MongoClient(uri, options);
const clientPromise = isDevelopment
  ? (global._mongoClientPromise ??= client.connect())
  : client.connect();

export default clientPromise;
export const db = client.db(process.env.MONGODB_DB ?? "booknest");

export async function getDb() {
  await clientPromise;
  return db;
}
