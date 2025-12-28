import { IcatalogRepository } from "../interface/catelogRepository.interface";
import { OrderWithLineItems } from "../types/message.types";
import { AppEventListener } from "../utils/AppEventListener";
import { ElasticSearchService } from "./elasticSearchService";

export class CatelogService {
  
  private _repository: IcatalogRepository
  
  constructor(repository:IcatalogRepository){
    this._repository = repository
  }
  
  
  async createProduct(input:any){
    const data = await this._repository.create(input);
    if(!data.id) {
      throw new Error("unable to create product")
    }
    //emit event to create record in Elastic Search
    AppEventListener.instance.notify({
      event: "createProduct",
      data,
    });
    return data;
  }

  async updateProduct(input:any){
    const data = await this._repository.update(input);
    if(!data.id) {
      throw new Error("unable to update product")
    }
    //emit event to update record in Elastic search
    AppEventListener.instance.notify({
      event:"updateProduct",
      data,
    });
    return data;
  }


  //instread of this we will get products from elastic search
  async getProducts(limit:number,offset:number,search:string){
    const elkService = new ElasticSearchService();
    const products = await elkService.searchProduct(search);
    // const products = await this._repository.find(limit,offset)
    return products;
  }

  async getProduct(id:number){
    const product = await this._repository.findOne(id);
    return product;
  }

  async deleteProducts(id:number){
    const response = await this._repository.delete(id);
    //delete record from elastic search 
    AppEventListener.instance.notify({
      event:"deleteProduct",
      data:{id}
    })
    return response;
  }

  async getProductStock(ids:number[]){
    const products = await this._repository?.findStock(ids);
    if(!products){
      throw new Error("unable to find product stock details");
    }
    return products;
  }

  async handleBrokerMessage(message:any){
    console.log("Catalog Service received message",message);
    const orderData = message.data as OrderWithLineItems;
    const {orderItems} = orderData;
    orderItems.forEach(async (item)=>{
      console.log("updating stock for product", item.productId,item.qty);
      const product = await this.getProduct(item?.productId);
      if(!product){
        console.log("Product not found during stock update for create order",
          item?.productId
        );
      }else{
        //update stock
        const updateStock = product.stock - item.qty;
        await this.updateProduct({...product,stock:updateStock});
      }
      //perform stock update operation
    })
  }

}