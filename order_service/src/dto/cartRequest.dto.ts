import {Static, Type} from "@sinclair/typebox";

export const CartRequestSchema = Type.Object({
  productId: Type.Integer(),
  qty: Type.Integer(),
});

export type CartRequestInput = Static<typeof CartRequestSchema>;

export const CartEditRequestSchema = Type.Object({
  id: Type.Integer(),
  qty: Type.Integer(),
});

export type CartEditRequestInput = Static<typeof CartEditRequestSchema>;


type cartLineItems = {
  id:number;
  productId:number;
  itemName: string;
  price: string;
  qty: number;
  variant: string |null;
  createdAt: Date;
  updatedAt: Date;
  availability?: number;
}

export interface cartWithLineItems {
  id: number;
  customerId: number;
  lineItems: cartLineItems[];
  createdAt: Date;
  updatedAt: Date;
}