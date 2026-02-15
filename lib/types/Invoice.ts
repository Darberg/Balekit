export interface InvoicePayload {
  /**
   * عنوان پیام
   */
  title: string;

  /**
   * توضیحات پیام
   */
  description: string;

  /**
   * مبلغ کل درخواست پول یا جمع‌سپاری
   */
  total_amount: number;
}

export class Invoice {
  title: string;
  description: string;
  totalAmount: number;

  constructor(payload: InvoicePayload) {
    this.title = payload.title;
    this.description = payload.description;
    this.totalAmount = payload.total_amount;
  }
}
