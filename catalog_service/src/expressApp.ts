import express from "express";
import catalogRouter from "./api/catalog.routes";
import { httpLogger, HandleErrorWithLogger } from './utils'
import { ElasticSearchService } from "./services/elasticSearch.service";
import { AppEventListener } from "./utils/AppEventListener";
import rateLimiter from "./services/redisRateLimiter.service";
import { metricsMiddleware, metricsHandler } from "./utils/metrics";

const app = express();
app.use(express.json());
app.use(httpLogger);
app.use(metricsMiddleware);

const elasticSerachInstance = new ElasticSearchService();
AppEventListener.instance.listen(elasticSerachInstance);

// Metrics endpoint for Prometheus
app.get("/metrics", metricsHandler);

app.use("/", rateLimiter, catalogRouter);

app.use(HandleErrorWithLogger);

export default app;