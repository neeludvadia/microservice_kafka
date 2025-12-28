import { Producer } from "kafkajs"
import { MessageBroker } from "../utils"
import { PaymentEvent } from "../types";
// import { HandleSubscription } from "./order.service";

// initialize the broker 
export const IntializeBroker = async()=>{
  const producer = await MessageBroker?.connectProducer<Producer>();
  producer?.on("producer.connect",async ()=>{
    console.log("Order Service Producer connected successfully");
  });
}


//publish dedicated events based on usecases
export const sendPaymentUpdateMessage = async(data:unknown)=>{
  await MessageBroker.publish({
    event:PaymentEvent.CREATE_PAYMENT,
    topic: "OrderEvents",
    headers:{},
    message:{
      data
    }
  })
}
