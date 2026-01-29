import { CartLineItem, cartLineItems } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto";
import { product } from "../dto/product.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { AuthorizeError, logger, NotFoundError } from "../utils";
import { GetProductDetails, GetStockDetails } from "../utils/broker";
import { cartOperationsTotal } from "../utils/metrics";

export const CreateCart = async (input: CartRequestInput & { customerId: number }, repo: CartRepositoryType) => {


  const product: product = await GetProductDetails(input.productId);
  logger.info(product);

  if (product.stock < input.qty) {
    throw new NotFoundError("Product is out of Stock");
  }

  //find  if the product is already exist in the cart
  const lineItem = await repo.findCartByProductId(input?.customerId, input?.productId);
  if (lineItem) {
    return repo?.updateCart(lineItem?.id, lineItem?.qty + input?.qty);
  }

  cartOperationsTotal.inc({ operation: 'add' });

  return await repo.createCart(input.customerId, {
    productId: product?.id,
    price: product?.price.toString(),
    qty: input?.qty,
    itemName: product?.name,
    variant: product?.variant,

  } as CartLineItem);

};

export const GetCart = async (id: number, repo: CartRepositoryType) => {

  // get customer cart data

  const cart = await repo.findCart(id);
  if (!cart) {
    throw new NotFoundError("cart does not exists");
  }

  //list out all line items in the cart
  const lineItems = cart.lineItems;

  if (!lineItems.length) {
    throw new NotFoundError("cart items not found");
  }


  //verify with inventory service if the product is still available
  const stockDetails = await GetStockDetails(
    lineItems?.map((item) => (item?.productId))
  )

  if (Array.isArray(stockDetails)) {
    //update stock availability in cart line items
    lineItems?.forEach(lineItems => {
      const stockItem = stockDetails?.find((stock) => (stock.id === lineItems?.productId));
      if (stockItem) {
        lineItems.availability = stockItem.stock;
      }
    });
  };

  //update cart line item
  cart.lineItems = lineItems;

  //return updated cart data with latest stock availability 
  return cart;
};

const authorizedCart = async (lineItemId: number, customerId: number, repo: CartRepositoryType) => {
  const cart = await repo?.findCart(customerId);
  if (!cart) {
    throw new NotFoundError("Cart does not exist");
  }

  const lintItem = cart.lineItems.find((item) => item?.id === lineItemId);
  if (!lintItem) {
    throw new AuthorizeError("you are not authorized to edit this cart");
  }

  return lintItem;

}


export const EditCart = async (input: CartEditRequestInput & { customerId: number }, repo: CartRepositoryType) => {
  await authorizedCart(input?.id, input?.customerId, repo);
  const data = await repo.updateCart(input?.id, input?.qty);
  cartOperationsTotal.inc({ operation: 'update' });
  return data;
};

export const DeleteCart = async (input: { id: number, customerId: number }, repo: CartRepositoryType) => {
  const data = await repo.deleteCart(input.id);
  cartOperationsTotal.inc({ operation: 'remove' });
  return data;
};