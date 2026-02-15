export interface SuccessfulPaymentPayload {
  /**
   * واحد قیمت
   * مثال: ریال (IRR)
   */
  currency: string;

  /**
   * مبلغ کل پرداخت
   */
  total_amount: number;

  /**
   * اطلاعات صورتحساب که در متد sendInvoice ارسال شده است
   */
  invoice_payload: string;

  /**
   * شناسه یکتای پرداخت
   * در پرداخت‌های کیف‌پولی معادل فیلد id در PreCheckoutQuery است
   */
  telegram_payment_charge_id: string;

  /**
   * شماره پیگیری تراکنش
   * اختیاری، فقط در صورت پرداخت از طریق کیف پول بله موجود است
   */
  provider_payment_charge_id?: string;
}
