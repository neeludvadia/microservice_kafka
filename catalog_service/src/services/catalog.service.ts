import { IcatalogRepository } from "../interface/catelogRepository.interface";

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
    return data;
  }

  async updateProduct(input:any){
    const data = await this._repository.update(input);
    if(!data.id) {
      throw new Error("unable to update product")
    }
    //emit event to update record in Elastic search
    return data;
  }


  //instread of this we will get products from elastic search
  async getProducts(limit:number,offset:number){
    const products = await this._repository.find(limit,offset)
    return products;
  }

  async getProduct(id:number){
    const product = await this._repository.findOne(id);
    return product;
  }

  async deleteProducts(id:number){
    const response = await this._repository.delete(id);
    //delete record from elastic search 
    return response;
  }

}