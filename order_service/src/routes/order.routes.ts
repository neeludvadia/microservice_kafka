import express,{Request,Response} from 'express'

const router = express.Router();

router.post("/order",async(req:Request,res:Response)=>{
  return res.status(200).json({message:"create order"});
})

router.get("/order/:id",async(req:Request,res:Response)=>{
  return res.status(200).json({message:"get order yb id"});
})

router.get("/order",async(req:Request,res:Response)=>{
  return res.status(200).json({message:"get order"});
})

router.patch("/order",async(req:Request,res:Response)=>{
  return res.status(200).json({message:"update order"});
})

router.delete("/order",async(req:Request,res:Response)=>{
  return res.status(200).json({message:"delete order"});
})

export default router;