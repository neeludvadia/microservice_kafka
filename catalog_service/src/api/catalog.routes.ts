import express, { NextFunction,Request,Response } from 'express';
import { CatalogRepository } from '../repository/catalog.repository';
import { CatelogService } from '../services/catalog.service';
import { RequestValiator } from '../utils/requestValidator';
import { CreateProductRequest, UpdateProductRequest } from '../dto/product.dto';


export const catalog_service = new CatelogService(new CatalogRepository());
const catalogRouter = express.Router();


//endpoints
catalogRouter.post("/products",
  async(req:Request, res:Response, next:NextFunction)=>{
    try {
      const {errors,input} = await RequestValiator(CreateProductRequest,req.body);
      if(errors){
        return res.status(400).json(errors);
      }
        const data = await catalog_service?.createProduct(input);
        return res.status(201).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  })


  catalogRouter.patch("/products/:id",
  async(req:Request, res:Response, next:NextFunction)=>{
    try {
      const {errors,input} = await RequestValiator(UpdateProductRequest,req.body);

      const id = parseInt(req?.params?.id) || 0;

      if(errors){
        return res.status(400).json(errors);
      }
        const data = await catalog_service?.updateProduct({id,...input});
        return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  })



  catalogRouter.get("/products",
  async(req:Request, res:Response, next:NextFunction)=>{
    const limit = Number(req.query["limit"]);
    const offset = Number(req.query["offset"]);
    try {
        const data = await catalog_service?.getProducts(limit,offset);
        return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  })


  catalogRouter.get("/products/:id",
  async(req:Request, res:Response, next:NextFunction)=>{
    const id = parseInt(req.params.id) || 0;
    try {
        const data = await catalog_service?.getProduct(id);
        return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  })


  catalogRouter.delete("/products/:id",
  async(req:Request, res:Response, next:NextFunction)=>{
    const id = parseInt(req.params.id) || 0;
    try {
        const data = await catalog_service?.deleteProducts(id);
        return res.status(200).json({id:data?.id});
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  })

export default catalogRouter;