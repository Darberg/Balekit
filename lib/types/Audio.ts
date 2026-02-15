export interface AudioPayload {
  /**
   * شناسه فایل صوتی
   * برای دانلود یا ارسال مجدد فایل استفاده می‌شود.
   */
  file_id: string;

  /**
   * شناسه منحصربه‌فرد فایل
   * ثابت در طول زمان و برای بازوهای مختلف
   * قابل استفاده برای دانلود یا ارسال نیست.
   */
  file_unique_id: string;

  /**
   * مدت زمان فایل صوتی به ثانیه
   */
  duration: number;

  /**
   * عنوان فایل صوتی
   * اختیاری
   */
  title?: string;

  /**
   * نام اصلی فایل
   * اختیاری
   */
  file_name?: string;

  /**
   * نوع MIME فایل صوتی
   * اختیاری
   */
  mime_type?: string;

  /**
   * حجم فایل به بایت
   * اختیاری
   * ممکن است بیشتر از 2^31 باشد، بنابراین ذخیره با int64 توصیه می‌شود.
   */
  file_size?: number;
}

export class Audio {
  fileId: string;
  fileUniqueId: string;
  duration: number;
  title: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;

  constructor(payload: AudioPayload) {
    this.fileId = payload.file_id;
    this.fileUniqueId = payload.file_unique_id;
    this.duration = payload.duration;
    this.title = payload.title ?? null;
    this.fileName = payload.file_name ?? null;
    this.mimeType = payload.mime_type ?? null;
    this.fileSize = payload.file_size ?? null;
  }
}
