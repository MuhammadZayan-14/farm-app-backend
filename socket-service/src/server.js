import dotenv from "dotenv";
import express from "express";
import http from "http";

import { initSocket } from "./sockets/chatSocket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

initSocket(server);

server.listen(5003, () => {
    console.log("Socket service running on 5003");
});