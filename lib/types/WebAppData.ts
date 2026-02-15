/**
 * داده‌ای که از طرف مینی‌اپ به بازو ارسال شده است.
 * دقت: این فیلد می‌تواند حاوی داده‌ای غیر واقعی باشد که توسط مینی‌اپ ارسال نشده است.
 */
export interface WebAppDataPayload {
  data: string;
}

export class WebAppData {
  data: string;

  constructor(payload: WebAppDataPayload) {
    this.data = payload.data;
  }
}
