import { PhotoSize, PhotoSizePayload } from './PhotoSize';

export interface DocumentPayload {
  /**
   * شناسه فایل
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
   * عکس کوچک سند (thumbnail)
   * اختیاری است و توسط ارسال‌کننده تعریف می‌شود.
   */
  thumbnail?: PhotoSizePayload;

  /**
   * نام اصلی فایل
   * اختیاری
   */
  file_name?: string;

  /**
   * نوع MIME فایل
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

export class Document {
  fileId: string;
  fileUniqueId: string;
  thumbnail: PhotoSize | null;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;

  constructor(payload: DocumentPayload) {
    this.fileId = payload.file_id;
    this.fileUniqueId = payload.file_unique_id;
    this.thumbnail = payload.thumbnail
      ? new PhotoSize(payload.thumbnail)
      : null;
    this.fileName = payload.file_name ?? null;
    this.mimeType = payload.mime_type ?? null;
    this.fileSize = payload.file_size ?? null;
  }
}
