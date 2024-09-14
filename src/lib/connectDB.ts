import { MongoClient, Db, ServerApiVersion } from "mongodb";

// Declare the types for db and client
let db: Db | undefined;
let client: MongoClient | undefined;

export const connectDB = async (): Promise<Db> => {
  if (db) return db;

  const uri = `mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PASS}@cluster0.nrdgddr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    if (!client) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      await client.connect();
      console.log("Connected to MongoDB");
    }
    db = client.db("doctorsPortal");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
};
