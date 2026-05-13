import { db } from "../db/index.js";
import {
    conversationParticipants,
    conversations,
    messages,
} from "../db/schema.js";

import { desc, eq } from "drizzle-orm";
import { publishEvent } from "../events/publisher.js";

export const getOrCreateConversation = async (user1, user2) => {
    const existing = await db
        .select()
        .from(conversationParticipants)
        .where(eq(conversationParticipants.userId, user1));

    const match = await db
        .select()
        .from(conversationParticipants)
        .where(eq(conversationParticipants.userId, user2));

    const found = existing.find(e =>
        match.some(m => m.conversationId === e.conversationId)
    );

    if (found) {
        return { conversationId: found.conversationId };
    }

    const convo = await db
        .insert(conversations)
        .values({})
        .returning();

    const conversationId = convo[0].id;

    await db.insert(conversationParticipants).values([
        { conversationId, userId: user1 },
        { conversationId, userId: user2 },
    ]);

    return { conversationId };
};

export const sendMessage = async (conversationId, senderId, message) => {
    const msg = await db
        .insert(messages)
        .values({
            conversationId,
            senderId,
            message,
            status: "sent",
        })
        .returning();

    const saved = msg[0];

    // EVENT → socket-service
    await publishEvent("chat:new_message", {
        message: saved,
    });

    return saved;
};

export const getMessages = async (conversationId) => {
    return await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(desc(messages.createdAt));
};

export const markSeen = async (conversationId, userId) => {
    await db
        .update(messages)
        .set({ status: "seen" })
        .where(eq(messages.conversationId, conversationId));

    await publishEvent("chat:seen", {
        conversationId,
        userId,
    });
};