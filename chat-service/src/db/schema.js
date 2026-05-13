import {
    pgTable,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";

/* ---------------- USERS (reference only) ---------------- */
/* We don't manage users here — only reference IDs */

/* ---------------- CONVERSATIONS ---------------- */

export const conversations = pgTable("conversations", {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
});

/* ---------------- PARTICIPANTS ---------------- */

export const conversationParticipants = pgTable(
    "conversation_participants",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        conversationId: uuid("conversation_id"),
        userId: uuid("user_id").notNull(),
        createdAt: timestamp("created_at").defaultNow(),
    }
);

/* ---------------- MESSAGES ---------------- */

export const messages = pgTable("messages", {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id"),
    senderId: uuid("sender_id").notNull(),
    message: text("message"),
    createdAt: timestamp("created_at").defaultNow(),
    status: text("status").default("sent"), // sent, delivered, seen
});