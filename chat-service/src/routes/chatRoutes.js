import express from "express";
import {
    createConversation,
    createMessage,
    fetchMessages,
    seenMessages,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/conversation", createConversation);
router.post("/message", createMessage);
router.get("/messages/:conversationId", fetchMessages);
router.post("/seen", seenMessages);

export default router;