import express from "express";
import catalogRouter from "./api/catalog.routes";
import { httpLogger, HandleErrorWithLogger } from './utils'
import { ElasticSearchService } from "./services/elasticSearch.service";
import { AppEventListener } from "./utils/AppEventListener";
import rateLimiter from "./services/redisRateLimiter.service";

const app = express();
app.use(express.json());
app.use(httpLogger);

const elasticSerachInstance = new ElasticSearchService();
AppEventListener.instance.listen(elasticSerachInstance);

app.use("/", rateLimiter, catalogRouter);

app.use(HandleErrorWithLogger);

export default app;