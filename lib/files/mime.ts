/**
 * الزامات MIME و نوع فایل برای ارسال با URL (بر اساس مستندات بله).
 */

/** برای sendAudio هنگام ارسال با URL باید MIME صحیح باشد (مثلاً audio/mpeg) */
export const RECOMMENDED_MIME_SEND_AUDIO = 'audio/mpeg';

/** برای sendVoice فایل باید audio/ogg باشد */
export const REQUIRED_MIME_SEND_VOICE = 'audio/ogg';

/**
 * در sendDocument ارسال با URL فقط برای این نوع فایل‌ها پشتیبانی می‌شود.
 * پسوند یا نوع رایج برای تشخیص.
 */
export const DOCUMENT_URL_ALLOWED_TYPES = ['gif', 'pdf', 'zip'] as const;

export type DocumentUrlAllowedType =
  (typeof DOCUMENT_URL_ALLOWED_TYPES)[number];
