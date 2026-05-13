import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import {
    setUserOffline,
    setUserOnline,
} from "../services/presenceService.js";

import { subscriber } from "../redis/subscriber.js";

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true,
        },
    });

    // -------------------------
    // AUTH MIDDLEWARE
    // -------------------------
    io.use((socket, next) => {
        const token =
            socket.handshake.auth?.token;

        if (!token) {
            return next(
                new Error("No token provided")
            );
        }

        try {
            const user = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Unauthorized"));
        }
    });

    // -------------------------
    // CONNECTION
    // -------------------------
    io.on("connection", async (socket) => {
        const userId = socket.user.id;

        // mark online
        await setUserOnline(userId, socket.id);

        io.emit("user:online", { userId });

        // -------------------------
        // JOIN ROOM (conversation)
        // -------------------------
        socket.on("join_room", (conversationId) => {
            socket.join(conversationId);
        });

        // -------------------------
        // SEND MESSAGE (REALTIME ONLY)
        // NOTE: DB is handled by chat-service via Redis
        // -------------------------
        socket.on("send_message", async (data) => {
            const {
                conversationId,
                message,
                senderId,
                tempId, // optional frontend message id
            } = data;

            io.to(conversationId).emit(
                "receive_message",
                {
                    conversationId,
                    message,
                    senderId,
                    tempId,
                    createdAt: new Date(),
                }
            );
        });

        // -------------------------
        // TYPING INDICATOR
        // -------------------------
        socket.on("typing", (data) => {
            socket.to(data.conversationId).emit(
                "user_typing",
                {
                    userId,
                    conversationId:
                        data.conversationId,
                }
            );
        });

        socket.on("stop_typing", (data) => {
            socket.to(data.conversationId).emit(
                "user_stop_typing",
                {
                    userId,
                    conversationId:
                        data.conversationId,
                }
            );
        });

        // -------------------------
        // MESSAGE DELIVERY ACK
        // -------------------------
        socket.on(
            "message_delivered",
            async (data) => {
                const { messageId, conversationId } =
                    data;

                io.to(conversationId).emit(
                    "message_delivered",
                    {
                        messageId,
                        conversationId,
                        deliveredAt: Date.now(),
                    }
                );
            }
        );

        // -------------------------
        // MESSAGE SEEN ACK
        // -------------------------
        socket.on("message_seen", (data) => {
            const { conversationId } = data;

            io.to(conversationId).emit(
                "message_seen",
                {
                    conversationId,
                    userId,
                }
            );
        });

        // -------------------------
        // REDIS EVENT BRIDGE (FROM CHAT SERVICE)
        // -------------------------
        subscriber.subscribe("chat:new_message");

        subscriber.on(
            "message",
            (channel, msg) => {
                if (channel === "chat:new_message") {
                    const data = JSON.parse(msg);

                    io.to(data.conversationId).emit(
                        "receive_message",
                        data.message
                    );
                }
            }
        );

        subscriber.subscribe(
            "chat:message_updated"
        );

        subscriber.on(
            "message",
            (channel, msg) => {
                if (
                    channel ===
                    "chat:message_updated"
                ) {
                    const data = JSON.parse(msg);

                    io.to(data.conversationId).emit(
                        "message_updated",
                        data
                    );
                }
            }
        );

        // -------------------------
        // DISCONNECT
        // -------------------------
        socket.on(
            "disconnect",
            async () => {
                await setUserOffline(userId);

                io.emit("user:offline", {
                    userId,
                    lastSeen: Date.now(),
                });
            }
        );
    });

    return io;
};