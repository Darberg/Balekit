import type { InputFile } from '../types/InputFile';

/**
 * ورودی ارسال فایل: یکی از سه روش.
 * - string: یا file_id (فایل قبلاً روی سرور بله) یا URL (بله خودش دانلود می‌کند)
 * - InputFile: ارسال با multipart/form-data
 */
export type FileInput = string | InputFile;

/**
 * نوع منبع فایل (برای تشخیص یا لاگ).
 */
export type FileSource = 'file_id' | 'url' | 'upload';

/**
 * تشخیص می‌دهد مقدار رشته احتمالاً URL است یا file_id.
 * (file_id معمولاً طولانی و بدون پروتکل است؛ URL با http(s) شروع می‌شود.)
 */
export function isFileUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

/**
 * اگر ورودی رشته باشد و با http شروع شود url است، وگرنه file_id.
 * اگر شیء/بافر باشد upload است.
 */
export function getFileSource(input: FileInput): FileSource {
  if (typeof input !== 'string') {
    return 'upload';
  }
  return isFileUrl(input) ? 'url' : 'file_id';
}
