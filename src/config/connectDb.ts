import 'dotenv/config';
import mongoose from "mongoose";

const ConnectDb = () => {
    const mongoURI : string = process.env.PORT ?? "";
    mongoose.connect(mongoURI, {
        autoIndex: false, // Disables automatic index creation in production for performance
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no MongoDB server is found
    }).then(() => {
        console.log("Connected to the Database");
    }).catch((error) => {
        console.log(error instanceof Error ? error.message : "Something went wrong start the server again");
    });
};

export default ConnectDb;