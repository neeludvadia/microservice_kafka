import express, { NextFunction,Request,Response } from 'express';

const catalogRouter = express.Router();


//endpoints
catalogRouter.post("/product",
  async(req:Request, res:Response, next:NextFunction)=>{
    return res.status(201).json({});
})

export default catalogRouter;