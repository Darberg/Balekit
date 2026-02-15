export interface FilePayload {
  /**
   * شناسه فایل
   * برای دانلود یا استفاده مجدد فایل استفاده می‌شود.
   */
  file_id: string;

  /**
   * شناسه منحصربه‌فرد فایل
   * ثابت در طول زمان و برای بازوهای مختلف
   * قابل استفاده برای دانلود یا ارسال نیست.
   */
  file_unique_id: string;

  /**
   * حجم فایل به بایت
   * اختیاری، ممکن است بیشتر از 2^31 باشد
   * ذخیره با int64 توصیه می‌شود.
   */
  file_size?: number;

  /**
   * مسیر فایل
   * اختیاری
   * برای دانلود از آدرس
   * https://tapi.bale.ai/file/bot<token>/<file_path>
   * استفاده می‌شود.
   */
  file_path?: string;
}

export class File {
  fileId: string;
  fileUniqueId: string;
  fileSize: number | null;
  filePath: string | null;

  constructor(payload: FilePayload) {
    this.fileId = payload.file_id ?? null;
    this.fileUniqueId = payload.file_unique_id ?? null;
    this.fileSize = payload.file_size ?? null;
    this.filePath = payload.file_path ?? null;
  }
}
