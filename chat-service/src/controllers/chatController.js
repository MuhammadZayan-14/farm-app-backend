import {
    getMessages,
    getOrCreateConversation,
    markSeen,
    sendMessage,
} from "../services/chatService.js";

export const createConversation = async (req, res) => {
    const { userId } = req.body;
    const currentUser = req.headers["x-user-id"];

    const result = await getOrCreateConversation(
        currentUser,
        userId
    );

    res.json(result);
};

export const createMessage = async (req, res) => {
    const { conversationId, message } = req.body;
    const senderId = req.headers["x-user-id"];

    const result = await sendMessage(
        conversationId,
        senderId,
        message
    );

    res.json(result);
};

export const fetchMessages = async (req, res) => {
    const { conversationId } = req.params;

    const messages = await getMessages(conversationId);

    res.json(messages);
};

export const seenMessages = async (req, res) => {
    const { conversationId } = req.body;
    const userId = req.headers["x-user-id"];

    await markSeen(conversationId, userId);

    res.json({ success: true });
};