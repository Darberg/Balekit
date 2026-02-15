import { PhotoSizePayload } from './PhotoSize';

export interface AnimationPayload {
  /**
   * شناسه فایل ویدیو
   * برای دانلود یا ارسال مجدد فایل استفاده می‌شود.
   */
  file_id: string;

  /**
   * شناسه منحصربه‌فرد فایل
   * در طول زمان و روی بازوهای مختلف ثابت است.
   * برای دانلود یا استفاده مجدد کاربرد ندارد.
   */
  file_unique_id: string;

  /**
   * پهنای تصویر ویدیو
   */
  width: number;

  /**
   * ارتفاع تصویر ویدیو
   */
  height: number;

  /**
   * مدت زمان ویدیو به ثانیه
   */
  duration: number;

  /**
   * عکس کوچک ویدیو (thumbnail)
   * اختیاری است
   */
  thumbnail?: PhotoSizePayload;

  /**
   * نام اصلی فایل ویدیو
   */
  file_name?: string;

  /**
   * نوع MIME فایل ویدیو
   */
  mime_type?: string;

  /**
   * حجم فایل به بایت
   * ممکن است بزرگ‌تر از 2^31 باشد، بنابراین ذخیره با int64 توصیه می‌شود.
   */
  file_size?: number;
}

export class Animation {
  fileId: string;
  fileUniqueId: string;
  width: number;
  height: number;
  duration: number;
  thumbnail: PhotoSizePayload | null;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;

  constructor(payload: AnimationPayload) {
    this.fileId = payload.file_id;
    this.fileUniqueId = payload.file_unique_id;
    this.width = payload.width;
    this.height = payload.height;
    this.duration = payload.duration;
    this.thumbnail = payload.thumbnail ?? null;
    this.fileName = payload.file_name ?? null;
    this.mimeType = payload.mime_type ?? null;
    this.fileSize = payload.file_size ?? null;
  }
}
