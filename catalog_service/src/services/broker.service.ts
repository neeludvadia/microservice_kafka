import { Consumer, Producer } from "kafkajs";
import { CatelogService } from "./catalog.service";
import { MessageBroker } from "../utils/broker";

export class BrokerService {

  private producer: Producer | null = null;
  private consumer:Consumer | null = null;
  private catelogService: CatelogService;

  constructor(catalogService:CatelogService){
    this.catelogService = catalogService;
  }

  public async initializeBroker(){
    this.producer = await MessageBroker?.connectProducer<Producer>();
  this.producer?.on("producer.connect",async ()=>{
    console.log("Catalog Service Producer connected successfully");
  });

  this.consumer = await MessageBroker?.connectConsumer<Consumer>();
  this.consumer.on("consumer.connect",async()=>{
    console.log("Catalog Service Consumer connected successfully");
  });

  // keep listening to consumer events
  // perfrom action based on event
  await MessageBroker?.subscribe(this.catelogService?.handleBrokerMessage.bind(this.catelogService),"CatalogEvents");
  }

  //publish discontinue product event
  public async sendDeleteProductMessage(data:any){

  }

}