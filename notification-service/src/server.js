import dotenv from "dotenv";
import express from "express";
import { startListeners } from "./events/listener.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.send("Notification Service Running 🚀");
});

// start Redis listeners
startListeners();

const PORT = 5004;

app.listen(PORT, () => {
    console.log(`Notification service running on ${PORT}`);
});