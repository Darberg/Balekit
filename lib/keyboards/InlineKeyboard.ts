import type { WebAppInfo, CopyTextButton } from './types';

/** شکل نهایی دکمه اینلاین برای API (snake_case) – فقط یکی از فیلدهای اختیاری */
export interface InlineKeyboardButtonPayload {
  text: string;
  url?: string;
  callback_data?: string;
  web_app?: WebAppInfo;
  copy_text?: CopyTextButton;
}

/** ورودی برای اضافه کردن دکمه (می‌توان از camelCase استفاده کرد) */
export type InlineKeyboardButtonInput =
  | string
  | (InlineKeyboardButtonPayload & {
      callbackData?: string;
      webApp?: WebAppInfo;
      copyText?: CopyTextButton;
    });

/**
 * InlineKeyboardMarkup – صفحه‌کلید اینلاین زیر پیام.
 * @see Bale Bot API: InlineKeyboardMarkup
 */
export class InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButtonPayload[][];

  constructor() {
    this.inline_keyboard = [];
  }

  private normalizeButton(
    btn: InlineKeyboardButtonInput
  ): InlineKeyboardButtonPayload {
    if (typeof btn === 'string') {
      return { text: btn, callback_data: btn };
    }
    const b = btn as InlineKeyboardButtonPayload & {
      callbackData?: string;
      webApp?: WebAppInfo;
      copyText?: CopyTextButton;
    };
    return {
      text: b.text,
      url: b.url,
      callback_data: b.callback_data ?? b.callbackData,
      web_app: b.web_app ?? b.webApp,
      copy_text: b.copy_text ?? b.copyText,
    };
  }

  /** اضافه کردن یک ردیف دکمه */
  addRow(
    buttons: InlineKeyboardButtonInput | InlineKeyboardButtonInput[]
  ): this {
    const row = Array.isArray(buttons) ? buttons : [buttons];
    this.inline_keyboard.push(row.map((b) => this.normalizeButton(b)));
    return this;
  }

  /** اضافه کردن دکمه با متن و callback_data یا url */
  addButton(text: string, callbackDataOrUrl: string): this {
    if (this.inline_keyboard.length === 0) this.inline_keyboard.push([]);
    const isUrl =
      typeof callbackDataOrUrl === 'string' &&
      callbackDataOrUrl.startsWith('http');
    this.inline_keyboard[this.inline_keyboard.length - 1].push({
      text,
      [isUrl ? 'url' : 'callback_data']: callbackDataOrUrl,
    } as InlineKeyboardButtonPayload);
    return this;
  }

  /** اضافه کردن دکمه با مینی‌اپ (Web App) */
  addWebAppButton(text: string, webAppUrl: string): this {
    if (this.inline_keyboard.length === 0) this.inline_keyboard.push([]);
    this.inline_keyboard[this.inline_keyboard.length - 1].push({
      text,
      web_app: { url: webAppUrl },
    });
    return this;
  }

  /** اضافه کردن دکمه رونوشت متن (CopyTextButton) */
  addCopyTextButton(text: string, copyText: string): this {
    if (this.inline_keyboard.length === 0) this.inline_keyboard.push([]);
    this.inline_keyboard[this.inline_keyboard.length - 1].push({
      text,
      copy_text: { text: copyText },
    });
    return this;
  }

  toJSON(): { inline_keyboard: InlineKeyboardButtonPayload[][] } {
    return { inline_keyboard: this.inline_keyboard };
  }
}

export function inlineKeyboard(): InlineKeyboardMarkup {
  return new InlineKeyboardMarkup();
}
