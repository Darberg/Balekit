/**
 * Types shared by keyboard markups (Bale Bot API).
 */

import { InlineKeyboardMarkup } from './InlineKeyboard';
import { ReplyKeyboardMarkup } from './ReplyKeyboard';
import { ReplyKeyboardRemove } from './ReplyKeyboardRemove';

/** اطلاعات مینی‌اپی که با فشردن دکمه باز می‌شود */
export interface WebAppInfo {
  url: string;
}

/** دکمه‌ای که متن مشخص شده را رونوشت می‌کند */
export interface CopyTextButton {
  text: string;
}

export type ReplyMarkup =
  | InlineKeyboardMarkup
  | ReplyKeyboardMarkup
  | ReplyKeyboardRemove;
