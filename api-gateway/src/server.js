import dotenv from "dotenv";
import express from "express";

import {
    authProxy,
    chatProxy,
    notificationProxy,
    socketProxy,
} from "./proxy.js";

dotenv.config();

const app = express();

// ROUTES
app.use("/auth", authProxy);
app.use("/chat", chatProxy);
app.use("/socket.io", socketProxy);
app.use("/notifications", notificationProxy);

app.get("/", (req, res) => {
    res.send("API Gateway running");
});

app.listen(5000, () => {
    console.log("API Gateway running on 5000");
});