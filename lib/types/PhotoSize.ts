export interface PhotoSizePayload {
  /**
   * شناسه فایل
   * برای دانلود یا ارسال مجدد تصویر استفاده می‌شود.
   */
  file_id: string;

  /**
   * شناسه منحصربه‌فرد فایل
   * ثابت در طول زمان و برای بازوهای مختلف
   * قابل استفاده برای دانلود یا ارسال نیست.
   */
  file_unique_id: string;

  /**
   * پهنای تصویر
   */
  width: number;

  /**
   * ارتفاع تصویر
   */
  height: number;

  /**
   * حجم فایل به بایت
   * اختیاری است
   */
  file_size?: number;
}

export class PhotoSize {
  constructor(payload: PhotoSizePayload) {}
}
