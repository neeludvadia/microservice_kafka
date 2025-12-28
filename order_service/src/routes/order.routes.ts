import express,{NextFunction, Request,Response} from 'express'
import { MessageBroker } from '../utils';
import { OrderEvent, OrderStatus } from '../types';
import { RequestAuthorizer } from './middleware';
import * as service from '../service/order.service'
import { OrderRepository } from '../repository/order.repository';
import { CartRepository } from '../repository/cart.repository';
const router = express.Router();


router.post("/orders",
  
  RequestAuthorizer,
  async(req:Request,res:Response,next:NextFunction)=>{
    const user = req.user;
    if(!user){
      next(new Error("user not found"));
      return;
    }
  
  const response = await service?.CreateOrder(user.id,OrderRepository,CartRepository);
 
  return res.status(200).json(response);
})

router.get("/order/:id",async(req:Request,res:Response,next:NextFunction)=>{
   const user = req.user;
    if(!user){
      next(new Error("user not found"));
      return;
    }

    const orderId = parseInt(req.params.id);
  
  const response = await service?.GetOrder(orderId,OrderRepository);
 
  return res.status(200).json(response);
})


router.get("/orders/:id",async(req:Request,res:Response,next:NextFunction)=>{
   const user = req.user;
    if(!user){
      next(new Error("user not found"));
      return;
    }

    const orderId = parseInt(req.params.id);
  const response = await service?.GetOrder(orderId,OrderRepository);
 
  return res.status(200).json(response);
})

router.get("/orders",
  RequestAuthorizer,
  async(req:Request,res:Response,next:NextFunction)=>{
   const user = req.user;
    if(!user){
      next(new Error("user not found"));
      return;
    }
  
  const response = await service?.GetOrders(user.id,OrderRepository);
 
  return res.status(200).json(response);
})

//only going to call from microservice
router.patch("/order",async(req:Request,res:Response,next:NextFunction)=>{
  //security check for microservice calls only
   const user = req.user;
    if(!user){
      next(new Error("user not found"));
      return;
    }

    const orderId = parseInt(req.params.id);
    const status =  req.body.status as OrderStatus;

  const response = await service?.UpdateOrder(orderId,status,OrderRepository);
 
  return res.status(200).json(response);
})

//only going to call from microservice
router.delete("/order",async(req:Request,res:Response,next:NextFunction)=>{
   const user = req.user;
    if(!user){
      next(new Error("user not found"));
      return;
    }

    const orderId = parseInt(req.params.id);
    const response = await service?.DeleteOrder(orderId,OrderRepository);
 
  return res.status(200).json(response);
})

router.get("/orders/:id/checkout", async(req: Request, res:Response)=>{
  const orderNumber = parseInt(req.params.id);
  const response = await service.CheckoutOrder(orderNumber, OrderRepository);
  return res.status(200).json(response);
});

export default router;