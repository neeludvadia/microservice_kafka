import axios from 'axios'
import { logger } from '../logger';
import { APIError, AuthorizeError, NotFoundError } from '../error';
import dotenv from "dotenv"
import { User } from '../../dto/User.Model';
import { InProcessOrder } from '../../dto/Order.model';
dotenv.config()
const ORDER_SERVICE_BASE__URL = process.env.ORDER_SERVICE_BASE__URL || "http://localhost:9002" //env variables

const AUTH_SERVICE_BASE_URL = process.env.AUTH_SERVICE_BASE_URL || "http://localhost:7002";


export const GetOrderDetails = async(orderNumber:number)=>{
  try {
    const response = await axios.get(`${ORDER_SERVICE_BASE__URL}/orders/${orderNumber}/checkout`);
    return response.data as InProcessOrder;
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("order not found");  
  }
}

export const ValidateUser = async (token:string)=>{
  try{
    // axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/auth/validate`,{
      headers: {
        Authorization: token,
      },
    });
    console.log(response.status,"this is status")
    if(response.status !== 200){
      throw new AuthorizeError("user not authorized");
    }
    return response.data as User;

  }catch(error){
    throw new AuthorizeError("user not authorized");
  }

}