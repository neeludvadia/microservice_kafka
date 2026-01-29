import express, { Response, Request, NextFunction } from "express";
import cors from 'cors';
import orderRoutes from './routes/order.routes'
import cartRoutes from './routes/cart.routes'
import { MessageBroker } from "./utils/broker";
import { Consumer, Producer } from "kafkajs";
import { httpLogger, HandleErrorWithLogger } from "./utils";
import { IntializeBroker } from "./service/broker.service";
import rateLimiter from "./service/redisRateLimiter.service";
import { metricsMiddleware, metricsHandler } from "./utils/metrics";

export const ExpressApp = async () => {
    const app = express();
    app.use(cors())
    app.use(express.json());
    app.use(httpLogger)
    app.use(metricsMiddleware);

    //kafka initalization
    await IntializeBroker();

    // Metrics endpoint for Prometheus
    app.get("/metrics", metricsHandler);

    app.use(rateLimiter, orderRoutes);
    app.use(rateLimiter, cartRoutes);

    app.use("/", (req: Request, res: Response, _: NextFunction) => {
        return res.status(200).json({ message: "I am healthy!" });
    });


    app.use(HandleErrorWithLogger);
    return app;
};
