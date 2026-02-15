/**
 * مدیا برای ارسال در sendMediaGroup و مانند آن.
 * media می‌تواند: file_id، HTTP URL، یا "attach://file_attach_name" باشد.
 */
export interface InputMediaPhotoPayload {
  type: 'photo';
  media: string;
  caption?: string;
}

export interface InputMediaVideoPayload {
  type: 'video';
  media: string;
  thumbnail?: string;
  caption?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface InputMediaAnimationPayload {
  type: 'animation';
  media: string;
  thumbnail?: string;
  caption?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface InputMediaAudioPayload {
  type: 'audio';
  media: string;
  thumbnail?: string;
  caption?: string;
  duration?: number;
  title?: string;
}

export interface InputMediaDocumentPayload {
  type: 'document';
  media: string;
  thumbnail?: string;
  caption?: string;
}

export type InputMediaPayload =
  | InputMediaPhotoPayload
  | InputMediaVideoPayload
  | InputMediaAnimationPayload
  | InputMediaAudioPayload
  | InputMediaDocumentPayload;

/** سازندهٔ ورودی برای تصویر */
export function inputMediaPhoto(
  media: string,
  caption?: string
): InputMediaPhotoPayload {
  return { type: 'photo', media, ...(caption != null ? { caption } : {}) };
}

/** سازندهٔ ورودی برای ویدیو */
export function inputMediaVideo(
  media: string,
  options: {
    thumbnail?: string;
    caption?: string;
    width?: number;
    height?: number;
    duration?: number;
  } = {}
): InputMediaVideoPayload {
  return { type: 'video', media, ...options };
}

/** سازندهٔ ورودی برای انیمیشن */
export function inputMediaAnimation(
  media: string,
  options: {
    thumbnail?: string;
    caption?: string;
    width?: number;
    height?: number;
    duration?: number;
  } = {}
): InputMediaAnimationPayload {
  return { type: 'animation', media, ...options };
}

/** سازندهٔ ورودی برای صوت */
export function inputMediaAudio(
  media: string,
  options: {
    thumbnail?: string;
    caption?: string;
    duration?: number;
    title?: string;
  } = {}
): InputMediaAudioPayload {
  return { type: 'audio', media, ...options };
}

/** سازندهٔ ورودی برای سند */
export function inputMediaDocument(
  media: string,
  options: { thumbnail?: string; caption?: string } = {}
): InputMediaDocumentPayload {
  return { type: 'document', media, ...options };
}
