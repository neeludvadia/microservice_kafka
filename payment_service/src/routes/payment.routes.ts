import express, { NextFunction, Request, Response } from "express";
import {RequestAuthorizer} from "./middleware"
import * as Service from "../service/payment.service"
import { PaymentGateway, StripePayment } from "../utils";


const router = express.Router();
const paymentGateway:PaymentGateway = StripePayment;

router.post(
  "/create-payment",
  RequestAuthorizer,
  async(req:Request,res:Response,next:NextFunction)=>{
    const user = req.user;
    if(!user){
      next(new Error("User not found"));
      return;
    }

    try {
      const {orderNumber} = req.body;
  
      const response = await Service?.CreatePayment(
        user.id,
        orderNumber,
        paymentGateway);

      return res.status(200).json({message:"Payment Successful", data: response});

    } catch (error) {
      next(error);
    }


});

router.post(
  "/verify-payment/:id",
  RequestAuthorizer,
  async(req:Request,res:Response,next:NextFunction)=>{

    const user = req.user;
    if(!user){
      next(new Error("User not found"));
      return;
    }

    const paymentId = req.params.id;
    if(!paymentId){
      next(new Error("Payment Id not found"));
      return;
    }

    await Service.VerifyPayment(paymentId, paymentGateway);

  return res.status(200).json({message:"Payment Verification Completed"});

});

export default router;