/**
 * قوانین ارسال فایل (خلاصهٔ مستندات بله).
 * برای استفاده در JSDoc، اعتبارسنجی اختیاری، یا راهنمای توسعه‌دهنده.
 */

export const FILE_ID_RULES = {
  /** تغییر نوع فایل در ارسال مجدد با file_id ممکن نیست (مثلاً ویدیو به‌صورت تصویر نه) */
  noTypeChange: true,
  /** ارسال مجدد thumbnail با file_id پشتیبانی نمی‌شود */
  noThumbnailResend: true,
  /** ارسال مجدد تصویر با file_id همه اندازه‌های آن تصویر را ارسال می‌کند */
  imageSendsAllSizes: true,
  /** file_id برای هر بازو منحصربه‌فرد است و بین بازوها قابل انتقال نیست */
  uniquePerBot: true,
  /** یک فایل می‌تواند چندین file_id معتبر حتی برای همان بازو داشته باشد */
  multipleIdsPossible: true,
} as const;

export const URL_SEND_RULES = {
  /** فایل باید MIME صحیح داشته باشد (مثلاً sendAudio: audio/mpeg) */
  correctMimeRequired: true,
  /** sendDocument با URL فقط برای GIF، PDF، ZIP */
  documentOnlyGifPdfZip: true,
  /** sendVoice با URL: فایل باید audio/ogg و حداکثر ۱ مگابایت؛ وگرنه به‌صورت سند ارسال می‌شود */
  voiceOggMax1MB: true,
} as const;
