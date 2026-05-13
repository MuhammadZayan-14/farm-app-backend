import { redis } from "../redis/client.js";

export const setUserOnline = async (userId, socketId) => {
    await redis.set(`user:online:${userId}`, socketId);
};

export const setUserOffline = async (userId) => {
    await redis.del(`user:online:${userId}`);
    await redis.set(`user:lastSeen:${userId}`, Date.now());
};

export const getUserSocket = async (userId) => {
    return await redis.get(`user:online:${userId}`);
};