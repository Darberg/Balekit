import type { WebAppInfo } from './types';

export interface ReplyKeyboardOptions {
  resizeKeyboard?: boolean;
  oneTimeKeyboard?: boolean;
  selective?: boolean;
}

/** شکل نهایی دکمه برای API (snake_case) */
export interface KeyboardButtonPayload {
  text: string;
  request_contact?: boolean;
  request_location?: boolean;
  web_app?: WebAppInfo;
}

/** ورودی برای اضافه کردن دکمه (می‌توان از camelCase استفاده کرد) */
export type KeyboardButtonInput =
  | string
  | (KeyboardButtonPayload & {
      requestContact?: boolean;
      requestLocation?: boolean;
      webApp?: WebAppInfo;
    });

/**
 * ReplyKeyboardMarkup – صفحه‌کلید سفارشی با دکمه‌های پاسخ.
 * @see Bale Bot API: ReplyKeyboardMarkup
 */
export class ReplyKeyboardMarkup {
  keyboard: KeyboardButtonPayload[][];
  resize_keyboard: boolean;
  one_time_keyboard: boolean;
  selective: boolean;

  constructor(options: ReplyKeyboardOptions = {}) {
    this.keyboard = [];
    this.resize_keyboard = options.resizeKeyboard ?? false;
    this.one_time_keyboard = options.oneTimeKeyboard ?? false;
    this.selective = options.selective ?? false;
  }

  /** نرمال کردن دکمه به شکل API */
  private normalizeButton(btn: KeyboardButtonInput): KeyboardButtonPayload {
    if (typeof btn === 'string') {
      return { text: btn };
    }
    return {
      text: btn.text,
      request_contact: btn.request_contact ?? btn.requestContact ?? false,
      request_location: btn.request_location ?? btn.requestLocation ?? false,
      web_app: btn.web_app ?? btn.webApp,
    };
  }

  /** اضافه کردن یک ردیف دکمه */
  addRow(buttons: KeyboardButtonInput | KeyboardButtonInput[]): this {
    const row = Array.isArray(buttons) ? buttons : [buttons];
    this.keyboard.push(row.map((b) => this.normalizeButton(b)));
    return this;
  }

  /** اضافه کردن یک دکمه متنی ساده */
  addButton(
    text: string,
    requestContact = false,
    requestLocation = false
  ): this {
    if (this.keyboard.length === 0) this.keyboard.push([]);
    this.keyboard[this.keyboard.length - 1].push({
      text,
      request_contact: requestContact,
      request_location: requestLocation,
    });
    return this;
  }

  /** اضافه کردن دکمه با مینی‌اپ (Web App) */
  addWebAppButton(text: string, webAppUrl: string): this {
    if (this.keyboard.length === 0) this.keyboard.push([]);
    this.keyboard[this.keyboard.length - 1].push({
      text,
      web_app: { url: webAppUrl },
    });
    return this;
  }

  toJSON(): Record<string, unknown> {
    return {
      keyboard: this.keyboard,
      resize_keyboard: this.resize_keyboard,
      one_time_keyboard: this.one_time_keyboard,
      selective: this.selective,
    };
  }
}

export function keyboard(options?: ReplyKeyboardOptions): ReplyKeyboardMarkup {
  return new ReplyKeyboardMarkup(options);
}
