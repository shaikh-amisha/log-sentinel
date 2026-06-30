import mongoose from "mongoose";

import { MONGO_URI } from "./env.js";

const connectDB = async () => {

    try {

        await mongoose.connect(MONGO_URI);

        console.log("MongoDB Connected");

    } catch (error) {

        console.error(error.message);

        process.exit(1);

    }

};

export default connectDB;