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
    const data = this._repository.update(input);
    //emit event to update record in Elastic search
    return data;
  }

  getProducts(limit:number,offset:number){

  }

  getProduct(id:number){

  }

  deleteProducts(id:number){

  }

}