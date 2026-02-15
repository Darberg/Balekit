/**
 * محدودیت‌های ارسال فایل در API بله (بر اساس مستندات).
 * همهٔ مقادیر به بایت هستند.
 */

/** ۵ مگابایت – حداکثر اندازه تصاویر هنگام ارسال با URL */
export const MAX_IMAGE_SIZE_BY_URL_BYTES = 5 * 1024 * 1024;

/** ۲۰ مگابایت – حداکثر اندازه سایر محتوا هنگام ارسال با URL */
export const MAX_OTHER_SIZE_BY_URL_BYTES = 20 * 1024 * 1024;

/** ۱۰ مگابایت – حداکثر اندازه تصاویر هنگام آپلود با multipart/form-data */
export const MAX_IMAGE_SIZE_MULTIPART_BYTES = 10 * 1024 * 1024;

/** ۵۰ مگابایت – حداکثر اندازه سایر فایل‌ها هنگام آپلود با multipart/form-data */
export const MAX_OTHER_SIZE_MULTIPART_BYTES = 50 * 1024 * 1024;

/** ۱ مگابایت – حداکثر حجم پیام صوتی (sendVoice) هنگام ارسال با URL؛ بیشتر از این به صورت سند ارسال می‌شود */
export const MAX_VOICE_SIZE_BY_URL_BYTES = 1 * 1024 * 1024;

/** ۲۰ مگابایت – پیام صوتی با حجم ۱ تا ۲۰ مگابایت به صورت سند ارسال می‌شود */
export const VOICE_AS_DOCUMENT_THRESHOLD_BYTES = 20 * 1024 * 1024;
