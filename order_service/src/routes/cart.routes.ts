import express,{Request,Response,NextFunction} from 'express'
import * as service from '../service/cart.service'
import * as repository from '../repository/cart.repository'
import { ValidateRequest } from '../utils/validator';
import { CartRequestInput, CartRequestSchema } from '../dto/cartRequest.dto';
import { RequestAuthorizer } from './middleware';
const router = express.Router();

const repo = repository.CartRepository


router.post("/cart",
  RequestAuthorizer,
  async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const user = req.user;
    if(!user){
      next(new Error("User not found"));
      return;
    }
    const error = ValidateRequest<CartRequestInput>(
      req.body,
      CartRequestSchema
    )

    if(error){
      return res.status(404).json({error});
    }

    const input:CartRequestInput = req.body;

    const reponse = await service.CreateCart(
      {
        ...input,
        customerId:user?.id
      },
      repo
    );
    return res.status(200).json(reponse);
  } catch (error) {
    return res.status(404).json({error});
  }
})

router.get("/cart",
  RequestAuthorizer,
  async(req:Request,res:Response,next:NextFunction)=>{

  try {
    const user = req.user;
    if(!user){
      next(new Error("User not found"));
      return;
    }

    console.log(req.body.customerId,"this is req body")
    const response = await service?.GetCart(req.body.customerId,repo);
    return res.status(200).json(response);
  }catch(error){
    next(error);
    }
})

router.patch("/cart/:lineItemId",
  RequestAuthorizer,
  async(req:Request,res:Response,next:NextFunction)=>{

   try {
    const user = req.user;
    if(!user){
      next(new Error("User not found"));
      return;
    }
    const lineItemId = req.params.lineItemId;
    const response = await service?.EditCart({
      id: +lineItemId,
      qty:req.body.qty,
      customerId:user?.id
    },repo);
    return res.status(200).json(response);

  }catch(error){
    next(error);
  }

})

router.delete("/cart/:lineItemId",
  RequestAuthorizer,
  async(req:Request,res:Response,next:NextFunction)=>{

   try {
    const user = req.user;
    if(!user){
      next(new Error("User not found"));
      return;
    }
    const lineItemId = req.params.lineItemId;
    console.log(lineItemId,'this is line item id')
    const response = await service?.DeleteCart({id:+lineItemId,customerId:user.id},repo);
    return res.status(200).json(response);
  }catch(error){
    next(error)
  }
  
})

export default router;