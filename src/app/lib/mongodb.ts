import mongoose from "mongoose";

async function connectToDatabase() {
  try {
    const uri: string = process.env.MONGODB_URI!;
    console.log("Mongo URI:", uri);
    const dbName: string = process.env.MONGODB_DB_NAME!;
    await mongoose.connect(uri, { dbName });
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export { connectToDatabase };
