import { Consumer, Producer } from "kafkajs"
import { MessageBroker } from "../utils"
import { OrderEvent } from "../types";
import { HandleSubscription } from "./order.service";

// initialize the broker 
export const IntializeBroker = async()=>{
  const producer = await MessageBroker?.connectProducer<Producer>();
  producer?.on("producer.connect",async ()=>{
    console.log("Order Service Producer connected successfully");
  });

  const consumer = await MessageBroker?.connectConsumer<Consumer>();
  consumer.on("consumer.connect",async()=>{
    console.log("Order Service Consumer connected successfully");
  });

  // keep listening to consumer events
  // perfrom action based on event
  await MessageBroker?.subscribe(HandleSubscription,"OrderEvents");

}


//publish dedicated events based on usecases
export const SendCreateOrderMessage = async(data:any)=>{
  await MessageBroker.publish({
    event:OrderEvent.CREATE_ORDER,
    topic: "CatalogEvents",
    headers:{},
    message:data
  })
}

export const SendOrderCanceledMessage = async(data:any)=>{
  await MessageBroker.publish({
    event:OrderEvent.CANCEL_ORDER,
    topic:"CatalogEvents",
    headers:{},
    message:data
  })
}
