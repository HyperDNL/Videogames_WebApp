import { connect } from "mongoose";
import { MONGODB_URI } from "../config/config.js";

export const connectDB = async () => {
  try {
    const db = await connect(MONGODB_URI);
    console.log("Connected to", db.connection.name);
  } catch (error) {
    console.error(error);
  }
};
