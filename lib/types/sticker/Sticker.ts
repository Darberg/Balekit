export interface StickerPayload {
  /**
   * شناسه فایل استیکر
   * برای دانلود یا ارسال مجدد فایل استفاده می‌شود.
   */
  file_id: string;

  /**
   * شناسه منحصربه‌فرد فایل
   * ثابت در طول زمان و روی بازوهای مختلف
   * قابل استفاده برای دانلود یا ارسال نیست.
   */
  file_unique_id: string;

  /**
   * نوع استیکر
   * مقادیر ممکن: "regular" | "mask"
   */
  type: 'regular' | 'mask';

  /**
   * پهنای استیکر
   */
  width: number;

  /**
   * ارتفاع استیکر
   */
  height: number;

  /**
   * اندازه فایل به بایت
   * اختیاری
   */
  file_size?: number;
}

export class Sticker {
  fileId: string;
  fileUniqueId: string;
  type: 'regular' | 'mask';
  width: number;
  height: number;
  fileSize: number | null;

  constructor(payload: StickerPayload) {
    this.fileId = payload.file_id;
    this.fileUniqueId = payload.file_unique_id;
    this.type = payload.type;
    this.width = payload.width;
    this.height = payload.height;
    this.fileSize = payload.file_size ?? null;
  }
}
