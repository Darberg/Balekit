/**
 * پیکربندی و تایپ‌های ارسال فایل در API بله.
 *
 * سه روش ارسال:
 * ۱) file_id (رشته) – فایل قبلاً روی سرور بله است؛ بدون محدودیت حجم
 * ۲) URL (رشته با http/https) – بله فایل را دانلود می‌کند؛ محدودیت حجم و MIME مطابق config
 * ۳) آپلود با multipart/form-data (Buffer/Stream/…) – محدودیت حجم مطابق config
 */

export {
  MAX_IMAGE_SIZE_BY_URL_BYTES,
  MAX_OTHER_SIZE_BY_URL_BYTES,
  MAX_IMAGE_SIZE_MULTIPART_BYTES,
  MAX_OTHER_SIZE_MULTIPART_BYTES,
  MAX_VOICE_SIZE_BY_URL_BYTES,
  VOICE_AS_DOCUMENT_THRESHOLD_BYTES,
} from './limits';

export {
  RECOMMENDED_MIME_SEND_AUDIO,
  REQUIRED_MIME_SEND_VOICE,
  DOCUMENT_URL_ALLOWED_TYPES,
  type DocumentUrlAllowedType,
} from './mime';

export { FILE_ID_RULES, URL_SEND_RULES } from './rules';

export type { FileInput, FileSource } from './types';
export { isFileUrl, getFileSource } from './types';

export { FILE_SEND_CONFIG, FILE_SEND_SUMMARY } from './config';
