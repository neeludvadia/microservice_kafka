import express from "express";
import catalogRouter from "./api/catalog.routes";
import { httpLogger, HandleErrorWithLogger } from './utils'
import { ElasticSearchService } from "./services/elasticSearchService";
import { AppEventListener } from "./utils/AppEventListener";

const app = express();
app.use(express.json());
app.use(httpLogger);

const elasticSerachInstance = new ElasticSearchService();
AppEventListener.instance.listen(elasticSerachInstance);

app.use("/",catalogRouter);

app.use(HandleErrorWithLogger);

export default app;