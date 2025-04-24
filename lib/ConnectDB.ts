import mongoose from "mongoose";

const MONGOURI = process.env.MONGODB_URI!;

if (!MONGOURI) {
  throw new Error("Please provide mongo url");
}

let cached = global.mongoose;

// console.log(cached, "Cached Value");

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const ConnectDB = async () => {
  if (cached.conn) {
    // console.log(cached.conn, "Cached Conn Value");

    return cached.conn;
  }

  if (!cached.promise) {
    let option = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGOURI, option).then((mongoose) => {
      return mongoose.connection;
    });
    // console.log(cached.promise, "Cached Promise Value");
  }

  cached.conn = await cached.promise;

  try {
    return cached.conn;
  } catch (error: any) {
    console.log(error);
    throw new Error("Something went wrong", error);
  }
};

export default ConnectDB;
