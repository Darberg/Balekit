/**
 * اطلاعات مربوط به درخواست ناموفق (مثلاً محدودیت نرخ ارسال).
 */
export interface ResponseParametersPayload {
  /** تعداد ثانیه‌های باقیمانده تا امکان ارسال مجدد درخواست */
  retry_after?: number;
}

export class ResponseParameters {
  retryAfter: number | null;

  constructor(payload: ResponseParametersPayload = {}) {
    this.retryAfter = payload.retry_after ?? null;
  }
}
