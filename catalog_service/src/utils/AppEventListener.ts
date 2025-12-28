// node core module to emit event
import {EventEmitter} from "events"
import { ElasticSearchService } from "../services/elasticSearchService";

export interface EventPayload {
  event: "createProduct" | "updateProduct" | "deleteProduct";
  data: unknown;
}

export class AppEventListener extends EventEmitter {
  //this is used to create static class so only one instance is create through out the application
  private static _instance: AppEventListener;

  private eventName: string = "ELASTIC_SEARCH_EVENT";

  private constructor(){
    super();
  };

  //this is used if the instance is already created just return the instance if not then create a new instance then return it
  static get instance(){
    return this._instance || (this._instance = new AppEventListener());
  }

    //this is to fire the event through out the application
    // and only eventpayload interface events are allowed
  notify(payload: EventPayload){
    this.emit(this.eventName, payload);
  }

  //this is going to help to listen any kind of event throught out the application
  listen(elasticSerachInstance: ElasticSearchService){
    this.on(this.eventName,(payload: EventPayload) =>{
      console.log("Event received:", payload);
      elasticSerachInstance.handleEvents(payload);
    });
  }

}