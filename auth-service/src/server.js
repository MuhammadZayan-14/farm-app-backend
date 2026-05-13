import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", authRoutes);

const PORT = 5001;

app.listen(PORT, () => {
    console.log("Auth service running on", PORT);
});