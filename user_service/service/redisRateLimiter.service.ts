import Redis from "ioredis";
import { NextFunction, Request, Response } from "express";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Rate limiter using Redis
const rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `rate-limit:${ip}`;

    const limit = 100; // Max requests
    const windowTime = 15 * 60; // 15 minutes in seconds

    try {
        const requests = await redis.incr(key);

        if (requests === 1) {
            // Set the expiration of the key to the time window on first request
            await redis.expire(key, windowTime);
        }

        if (requests > limit) {
            res.status(429).json({ message: 'Too many requests, try again later.' });
            return;
        }

        next();
    } catch (error) {
        console.error("Rate limiter error:", error);
        // Fail-open: allow request if Redis is unavailable
        next();
    }
};

export default rateLimiter;