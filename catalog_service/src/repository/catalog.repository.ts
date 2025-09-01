import { PrismaClient } from "../generated/prisma";
import { IcatalogRepository } from "../interface/catelogRepository.interface";
import { Product } from "../models/product.model";

export class CatalogRepository implements IcatalogRepository {
  _prisma: PrismaClient
  constructor(){
    this._prisma = new PrismaClient();
  }

  create(data: Product): Promise<Product> {
    return this._prisma?.product?.create({
      data
    })
  }
  update(data: Product): Promise<Product> {
    return this._prisma?.product?.update({
      where:{
        id:data?.id
      },
      data:data
    })
  }
  delete(id: any) {
    return this._prisma?.product?.delete({
      where:{
        id
      }
    })
  }
  find(limit:number, offset:number): Promise<Product[]> {
    return this._prisma?.product?.findMany({
      take:limit,
      skip:offset,
    })
  }
  async findOne(id: number): Promise<Product> {
    const product = await this._prisma?.product?.findFirst({
      where:{id},
    })
    if(product){
      return Promise.resolve(product)
    }

    throw new Error("product not found");
  }

  
}