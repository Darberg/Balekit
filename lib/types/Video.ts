export interface VideoPayload {
  /**
   * شناسه فایل ویدیو
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
   * پهنای ویدیو
   */
  width: number;

  /**
   * ارتفاع ویدیو
   */
  height: number;

  /**
   * مدت زمان ویدیو به ثانیه
   */
  duration: number;

  /**
   * نام اصلی فایل
   * اختیاری
   */
  file_name?: string;

  /**
   * نوع MIME فایل ویدیو
   * اختیاری
   */
  mime_type?: string;

  /**
   * حجم فایل به بایت
   * اختیاری، ممکن است بیشتر از 2^31 باشد
   * ذخیره با int64 توصیه می‌شود.
   */
  file_size?: number;
}

export class Video {
  fileId: string;
  fileUniqueId: string;
  width: number;
  height: number;
  duration: number;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;

  constructor(payload: VideoPayload) {
    this.fileId = payload.file_id;
    this.fileUniqueId = payload.file_unique_id;
    this.width = payload.width;
    this.height = payload.height;
    this.duration = payload.duration;
    this.fileName = payload.file_name ?? null;
    this.mimeType = payload.mime_type ?? null;
    this.fileSize = payload.file_size ?? null;
  }
}
