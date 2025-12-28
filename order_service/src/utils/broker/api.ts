import axios, { AxiosResponse } from 'axios'
import { logger } from '../logger';
import { APIError, AuthorizeError, NotFoundError } from '../error';
import { product } from '../../dto/product.dto';
import dotenv from "dotenv"
import { User } from '../../dto/User.Model';
dotenv.config()
const CATALOG_BASE__URL = process.env.CATALOG_BASE_URL || "http://localhost:9001" //env variables

const AUTH_SERVICE_BASE_URL = process.env.AUTH_SERVICE_BASE_URL || "http://localhost:7000";


export const GetProductDetails = async(productId:number)=>{
  try {
    const response:AxiosResponse = await axios.get(`${CATALOG_BASE__URL}/products/${productId}`);
    const product:product = response?.data;
    return product;
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("product not found");  
  }
}

export const GetStockDetails = async(ids:number[])=>{
  try {
    const response = await axios.post(`${CATALOG_BASE__URL}/products/stock`,{
      ids,
    });
    return response.data as product[];
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("error on getting stock details");
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

    if(response.status !== 200){
      throw new AuthorizeError("user not authorized");
    }
    return response.data as User;

  }catch(error){
    throw new AuthorizeError("user not authorized");
  }

}