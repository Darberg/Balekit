import Stream from 'stream';

/**
 * محتوای فایل برای آپلود.
 * باید با multipart/form-data (مشابه آپلود از مرورگر) ارسال شود.
 */
export type InputFile = Buffer | Stream.Readable | Blob | File;
