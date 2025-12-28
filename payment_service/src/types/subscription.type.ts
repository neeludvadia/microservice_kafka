export enum PaymentEvent {
  CREATE_PAYMENT = "create_payment",
  CANCEL_PAYMENT = "cancel_payment",
}

export type TOPIC_TYPE = "OrderEvents";

export interface MessageType {
  headers?: Record<string, any>;
  event: PaymentEvent;
  data: Record<string, any>;
}