import { NextFunction,Response,Request } from "express";
import { ValidateUser } from "../utils";

export const RequestAuthorizer =async(req:Request,res:Response, next:NextFunction) =>{
  try {
    if(!req.headers.authorization){
      return res.status(403).json({errro:"Unauthorized due to missing token!" });
    }
    const Userdata = await ValidateUser(req.headers.authorization as string);
    console.log(Userdata,"this is user data")
    req.user = Userdata;
     next();
  } catch (error) {
    return res.status(403).json({error:"Unauthorized"});
  }
}