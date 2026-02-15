/**
 * شیء ورودی برای اضافه‌کردن استیکر به بسته (createNewStickerSet / addStickerToSet).
 * sticker معمولاً file_id برگشتی از uploadStickerFile است.
 */
export interface InputSticker {
  sticker: string;
  emoji_list?: string[];
}
