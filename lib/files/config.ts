import {
  MAX_IMAGE_SIZE_BY_URL_BYTES,
  MAX_OTHER_SIZE_BY_URL_BYTES,
  MAX_IMAGE_SIZE_MULTIPART_BYTES,
  MAX_OTHER_SIZE_MULTIPART_BYTES,
  MAX_VOICE_SIZE_BY_URL_BYTES,
} from './limits';
import {
  RECOMMENDED_MIME_SEND_AUDIO,
  REQUIRED_MIME_SEND_VOICE,
  DOCUMENT_URL_ALLOWED_TYPES,
} from './mime';
import { FILE_ID_RULES, URL_SEND_RULES } from './rules';

/**
 * پیکربندی یک‌جا برای ارسال فایل‌ها – قابل فهم و استفاده در اعتبارسنجی یا UI.
 *
 * سه روش ارسال:
 * ۱) file_id – فایل روی سرور بله؛ بدون محدودیت حجم
 * ۲) URL – بله فایل را دانلود می‌کند؛ محدودیت بر اساس limits
 * ۳) multipart/form-data – آپلود مستقیم؛ محدودیت بر اساس limits
 */
export const FILE_SEND_CONFIG = {
  /** محدودیت‌های حجم (بایت) */
  limits: {
    /** ارسال با URL */
    byUrl: {
      image: MAX_IMAGE_SIZE_BY_URL_BYTES,
      other: MAX_OTHER_SIZE_BY_URL_BYTES,
      voiceMaxForVoice: MAX_VOICE_SIZE_BY_URL_BYTES,
    },
    /** ارسال با multipart/form-data */
    byMultipart: {
      image: MAX_IMAGE_SIZE_MULTIPART_BYTES,
      other: MAX_OTHER_SIZE_MULTIPART_BYTES,
    },
  },

  /** الزامات MIME برای ارسال با URL */
  mime: {
    sendAudio: RECOMMENDED_MIME_SEND_AUDIO,
    sendVoice: REQUIRED_MIME_SEND_VOICE,
  },

  /** نوع فایل‌های مجاز برای sendDocument با URL */
  documentUrlTypes: DOCUMENT_URL_ALLOWED_TYPES,

  /** قوانین استفاده از file_id */
  fileIdRules: FILE_ID_RULES,

  /** قوانین استفاده از URL */
  urlRules: URL_SEND_RULES,
} as const;

/** خلاصهٔ متنی برای نمایش به توسعه‌دهنده یا در خطا */
export const FILE_SEND_SUMMARY = {
  fileId: 'فایل روی سرور بله؛ بدون محدودیت حجم؛ نوع فایل قابل تغییر نیست.',
  url: `با URL: تصاویر تا ${MAX_IMAGE_SIZE_BY_URL_BYTES / 1024 / 1024} مگابایت، سایر تا ${MAX_OTHER_SIZE_BY_URL_BYTES / 1024 / 1024} مگابایت. MIME صحیح لازم است.`,
  multipart: `با multipart: تصاویر تا ${MAX_IMAGE_SIZE_MULTIPART_BYTES / 1024 / 1024} مگابایت، سایر تا ${MAX_OTHER_SIZE_MULTIPART_BYTES / 1024 / 1024} مگابایت.`,
} as const;
