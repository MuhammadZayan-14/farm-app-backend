import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

/* Send events to other services */
export const publishEvent = async (channel, data) => {
    await redis.publish(channel, JSON.stringify(data));
};