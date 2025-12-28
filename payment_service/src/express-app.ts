import express, { Response,Request, NextFunction } from "express";
import cors from 'cors';
import { MessageBroker } from "./utils/broker";
import { Consumer, Producer } from "kafkajs";
import { httpLogger,HandleErrorWithLogger } from "./utils";
import { IntializeBroker } from "./service/broker.service";
import paymentRoutes from "./routes/payment.routes"

export const ExpressApp = async ()=>{ 
  const app = express();
  app.use(cors({origin:"*"}));
  app.use(express.json());
  app.use(httpLogger)

  //kafka initalization
  await IntializeBroker();

  app.use(paymentRoutes);
  
  app.use("/",(req:Request, res:Response, _:NextFunction)=>{
    return res.status(200).json({message:"I am healthy!"});
  });
  
  
  app.use(HandleErrorWithLogger);
  return app;
};
