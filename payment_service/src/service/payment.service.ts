import { send } from "process";
import { GetOrderDetails } from "../utils";
import { PaymentGateway } from "../utils";
import { sendPaymentUpdateMessage } from "./broker.service";

export const CreatePayment = async(
    userId:number,
    orderNumber: number,
    paymentGateway: PaymentGateway
  )=>{
    // get order details from order service
    const order = await GetOrderDetails(orderNumber);
    if(order?.customerId !== userId){
      throw new Error("user not authorized to create payment");
    }

    console.log("order details",JSON.stringify(order));
    //create a new payment record
    const amountInCents = order.amount * 100; //converting amount into cents

    const orderMetaData ={
      orderNumber: order.orderNumber,
      amount: amountInCents,
      userId: userId
    }

    // call payment gateway to create payment
    const paymentResponse = await paymentGateway.createPayment(amountInCents, orderMetaData);
    console.log(paymentResponse,"this is payment response");
    //return payment secrets
    
  return {
    secret: paymentResponse?.secret,
    pubKey: paymentResponse?.pubKey,
    amount: paymentResponse?.amount,
    order:order // just to test
  };
};

export const VerifyPayment = async(paymentId:string, paymentGateway: PaymentGateway)=>{
  
  //call payment Gateway to verify payment
  const paymentResponse = await paymentGateway.getPayment(paymentId);
  console.log("PaymentStatus",paymentResponse.status);
  console.log("PaymentLog", paymentResponse.paymentLog);
  
  //update order status through message broker
  const response = await sendPaymentUpdateMessage({
    orderNumber: paymentResponse?.orderNumber,
    status: paymentResponse?.status,
    paymentLog: paymentResponse?.paymentLog
  });
  console.log(response, "this is the response message from broker")
  //return payment status <= not neccesary just for reponse to frontend
  return {
    message: "payment verified",
    status: paymentResponse.status,
    paymentLog: paymentResponse.paymentLog,
  };
}