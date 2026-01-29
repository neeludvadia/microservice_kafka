import express, { Response, Request, NextFunction } from "express";
import cors from 'cors';
import { MessageBroker } from "./utils/broker";
import { Consumer, Producer } from "kafkajs";
import { httpLogger, HandleErrorWithLogger } from "./utils";
import { IntializeBroker } from "./service/broker.service";
import paymentRoutes from "./routes/payment.routes"
import { metricsMiddleware, metricsHandler } from "./utils/metrics";

export const ExpressApp = async () => {
    const app = express();
    app.use(cors({ origin: "*" }));
    app.use(express.json());
    app.use(httpLogger)
    app.use(metricsMiddleware);

    //kafka initalization
    await IntializeBroker();

    // Metrics endpoint for Prometheus
    app.get("/metrics", metricsHandler);

    app.use(paymentRoutes);

    app.use("/", (req: Request, res: Response, _: NextFunction) => {
        return res.status(200).json({ message: "I am healthy!" });
    });


    app.use(HandleErrorWithLogger);
    return app;
};
