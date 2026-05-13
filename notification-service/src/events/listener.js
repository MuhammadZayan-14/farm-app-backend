import { redis } from "../redis/client.js";
import {
    handleNewMessageNotification,
    handleSeenNotification,
} from "../services/notificationService.js";

export const startListeners = () => {
    const subscriber = redis.duplicate();

    // 🔔 NEW MESSAGE EVENT
    subscriber.subscribe("chat:new_message");

    subscriber.on("message", async (channel, msg) => {
        const data = JSON.parse(msg);

        if (channel === "chat:new_message") {
            await handleNewMessageNotification(data);
        }
    });

    // 👁 SEEN EVENT
    subscriber.subscribe("chat:seen");

    subscriber.on("message", async (channel, msg) => {
        const data = JSON.parse(msg);

        if (channel === "chat:seen") {
            await handleSeenNotification(data);
        }
    });

    console.log("📡 Notification listeners started");
};