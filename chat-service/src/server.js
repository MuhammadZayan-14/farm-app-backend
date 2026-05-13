import dotenv from "dotenv";
import express from "express";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", chatRoutes);

app.listen(5002, () => {
    console.log("Chat service running on 5002");
});