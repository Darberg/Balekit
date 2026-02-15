import { User, UserPayload } from '../User';

export interface PreCheckoutQueryPayload {
  id: string;
  from: UserPayload;
  currency: string;
  total_amount: number;
  invoice_payload: string;
}

export class PreCheckoutQuery {
  id: string;
  from: User;
  currency: string;
  totalAmount: number;
  invoicePayload: string;

  constructor(payload: PreCheckoutQueryPayload) {
    this.id = payload.id;
    this.from = new User(payload.from);
    this.currency = payload.currency;
    this.totalAmount = payload.total_amount;
    this.invoicePayload = payload.invoice_payload;
  }
}
