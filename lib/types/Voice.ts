export interface VoicePayload {
  /**
   * شناسه فایل پیام صوتی
   * برای دانلود یا ارسال مجدد فایل استفاده می‌شود.
   */
  file_id: string;

  /**
   * شناسه منحصربه‌فرد فایل
   * ثابت در طول زمان و روی بازوهای مختلف
   * قابل استفاده برای دانلود یا ارسال نیست.
   */
  file_unique_id: string;
}

export class Voice {
  fileId: string;
  fileUniqueId: string;

  constructor(payload: VoicePayload) {
    this.fileId = payload.file_id;
    this.fileUniqueId = payload.file_unique_id;
  }
}
