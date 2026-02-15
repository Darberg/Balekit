export type TransactionStatus = 'pending' | 'paid' | 'failed' | 'rejected';

export interface TransactionPayload {
  id: string;
  status: TransactionStatus;
  userID?: number;
  user_id?: number;
  amount: number;
  createdAt?: number;
  created_at?: number;
}

export class Transaction {
  id: string;
  status: TransactionStatus;
  userId: number;
  amount: number;
  createdAt: number;

  constructor(payload: TransactionPayload) {
    this.id = payload.id;
    this.status = payload.status;
    this.userId = payload.userID ?? payload.user_id ?? 0;
    this.amount = payload.amount;
    this.createdAt = payload.createdAt ?? payload.created_at ?? 0;
  }
}
