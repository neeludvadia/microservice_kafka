import express from 'express';
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.routes'
import cors from "cors";
import rateLimiter from './service/redisRateLimiter.service';
import { metricsMiddleware, metricsHandler } from "./utils/metrics";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 6000;

app.use(cors({ origin: "*", credentials: true }))
app.use(express.json());
app.use(metricsMiddleware);

// Metrics endpoint for Prometheus
app.get("/metrics", metricsHandler);

// app.use(rateLimiter);
app.use("/auth", rateLimiter, authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});