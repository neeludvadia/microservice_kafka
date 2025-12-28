export type PaymentGateway = {
  createPayment:(
    amount:number,
    metadata:{ orderNumber:number; userId:number}
  )=>Promise<{secret:string; pubKey:string; amount:number}>;
  getPayment:(payment:string)=> Promise<Record<string,unknown>>;
}

