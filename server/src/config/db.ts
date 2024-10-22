import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "MongoDB URI is not defined in the environment variables."
      );
    }

    const connect = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDb;
