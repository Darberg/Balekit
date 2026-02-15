import https from 'https';
import http from 'http';
import { BaleApiError } from '../errors';
import {
  ChatFullInfo,
  type ChatFullInfoPayload,
  type ChatMember,
  createChatMember,
  type ChatMemberPayload,
  InputMediaPayload,
  User,
  UserPayload,
} from '../types';
import { MessageId } from '../types/MessageId';
import { InputFile } from '../types/InputFile';
import { InlineKeyboardMarkup } from '../keyboards/InlineKeyboard';
import { ReplyKeyboardMarkup } from '../keyboards/ReplyKeyboard';
import { ReplyKeyboardRemove } from '../keyboards/ReplyKeyboardRemove';
import { File, type FilePayload } from '../types/File';
import type { InputSticker } from '../types/sticker/InputSticker';
import type { LabeledPrice } from '../types/LabeledPrice';
import {
  Transaction,
  type TransactionPayload,
} from '../types/payment/Transaction';
import { ReplyMarkup } from '../keyboards/types';

export interface GetUpdatesParams {
  offset?: number;
  limit?: number;
  timeout?: number;
}

export interface SendMessageParams {
  chat_id: number;
  text: string;
  parse_mode?: string;
  reply_to_message_id?: number;
  reply_markup?: unknown;
  [key: string]: unknown;
}

type ContentType =
  | 'query_string'
  | 'application/x-www-form-urlencoded'
  | 'application/json'
  | 'multipart/form-data';

type ChatActionsType =
  | 'upload_photo'
  | 'typing'
  | 'record_video'
  | 'upload_video'
  | 'record_voice'
  | 'upload_voice'
  | 'choose_sticker';

/**
 * Low-level HTTP client for Bale Bot API.
 * All methods return Promises.
 */
export class ApiClient {
  private basePath: string;
  private _contentType: ContentType;
  private _requestTimeout: number;

  constructor(
    token: string,
    baseUrl = 'https://tapi.bale.ai/bot',
    contentType: ContentType = 'application/json',
    requestTimeout = 65000
  ) {
    const base = baseUrl.replace(/\/$/, '');
    token = token.trim();
    this.basePath = `${base}${token}`;
    this._contentType = contentType;
    this._requestTimeout = requestTimeout;
  }

  set contentType(contentType: ContentType) {
    this._contentType = contentType;
  }

  /**
   * Make a request to the Bale API.
   * @param method - API method name (e.g. getMe, sendMessage)
   * @param body - Request body (sent as JSON for POST)
   * @param timeout - Optional request timeout in ms (overrides constructor default)
   * @returns Promise resolving to the API result; use generic T for typed result (e.g. `this.request<User>('getMe')`)
   */
  request<T = unknown>(
    method: string,
    body: Record<string, any> = {},
    timeout?: number
  ): Promise<T> {
    const url = new URL(`${this.basePath}/${method}`);
    const client = url.protocol === 'https:' ? https : http;

    let payload: Buffer | string | undefined;
    const headers: Record<string, string> = {};

    // -------- transport strategy --------
    if (this._contentType === 'query_string') {
      Object.entries(body).forEach(([k, v]) =>
        url.searchParams.append(k, String(v))
      );
    }

    if (this._contentType === 'application/json') {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    if (this._contentType === 'application/x-www-form-urlencoded') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      payload = new URLSearchParams(body).toString();
    }

    if (this._contentType === 'multipart/form-data') {
      const boundary = '----NodeBoundary' + Date.now();
      headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;

      const chunks: Buffer[] = [];

      for (const [key, value] of Object.entries(body)) {
        if (Buffer.isBuffer(value)) {
          chunks.push(
            Buffer.from(
              `--${boundary}\r\n` +
                `Content-Disposition: form-data; name="${key}"; filename="${key}"\r\n` +
                `Content-Type: application/octet-stream\r\n\r\n`
            )
          );
          chunks.push(value);
          chunks.push(Buffer.from('\r\n'));
        } else {
          chunks.push(
            Buffer.from(
              `--${boundary}\r\n` +
                `Content-Disposition: form-data; name="${key}"\r\n\r\n` +
                `${value}\r\n`
            )
          );
        }
      }

      chunks.push(Buffer.from(`--${boundary}--`));
      payload = Buffer.concat(chunks);
    }

    const options: https.RequestOptions = {
      method: this._contentType === 'query_string' ? 'GET' : 'POST',
      headers,
    };

    return new Promise<T>((resolve, reject) => {
      const req = client.request(url, options, (res) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');

          if (res.statusCode && res.statusCode >= 400) {
            return reject(new BaleApiError(`HTTP ${res.statusCode}: ${raw}`));
          }

          try {
            const json = raw ? JSON.parse(raw) : {};

            if (json.ok === false) {
              return reject(
                new BaleApiError(
                  json.description ?? 'Unknown API error',
                  json.error_code,
                  json
                )
              );
            }

            resolve(json.result as T);
          } catch {
            reject(new BaleApiError('Invalid JSON response: ' + raw));
          }
        });
      });

      req.on('error', reject);

      const reqTimeout = timeout ?? this._requestTimeout;
      req.setTimeout(reqTimeout, () => {
        req.destroy(new Error('Request timeout'));
      });

      if (payload && options.method === 'POST') {
        req.write(payload);
      }

      req.end();
    });
  }

  async getMe(): Promise<User> {
    const result = await this.request<UserPayload>('getMe');
    return new User(result);
  }

  getUpdates(params: GetUpdatesParams = {}): Promise<unknown> {
    const body = params as Record<string, unknown>;
    const longPollTimeout = (params.timeout ?? 0) * 1000;
    const requestTimeout = longPollTimeout
      ? longPollTimeout + 10000
      : undefined;
    return this.request('getUpdates', body, requestTimeout);
  }

  sendMessage(
    chatId: number,
    text: string,
    options?: {
      reply_to_message_id?: number,
      reply_markup?: ReplyMarkup
    }
  ): Promise<unknown> {
    return this.request('sendMessage', {
      chat_id: chatId,
      text,
      ...options,
    });
  }

  /**
   * بازارسال یک پیام از یک گفتگو به گفتگوی دیگر
   * @see https://docs.bale.ai/#forwardmessage
   */
  forwardMessage(
    chatId: number,
    fromChatId: number,
    messageId: number
  ): Promise<unknown> {
    return this.request('forwardMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
    });
  }

  /**
   * کپی کردن یک پیام از یک گفتگو به گفتگوی دیگر
   * @see https://docs.bale.ai/#copymessage
   */
  copyMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number
  ): Promise<MessageId> {
    return this.request('copyMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
    });
  }

  /**
   * ارسال تصویر
   * @see https://docs.bale.ai/#sendphoto
   */
  sendPhoto(
    chatId: number | string,
    fromChatId: string | number,
    photo: string | InputFile,
    options?: {
      caption?: string;
      reply_to_message_id?: number;
      reply_markup?: ReplyMarkup;
    }
  ): Promise<unknown> {
    return this.request('sendPhoto', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      photo: photo,
       ...options,
    });
  }

  /**
   * ارسال فایل صوتی
   * @see https://docs.bale.ai/#sendaudio
   */

  sendAudio(
    chatId: string | number,
    audio: string | InputFile,
    options?: {
      caption?: string;
      reply_to_message_id?: string;
      reply_markup?: ReplyMarkup;
    }
  ) {
    return this.request('sendAudio', {
      chat_id: chatId,
      audio: audio,
      ...options,
    });
  }

  /**
   * ارسال فایل عمومی
   * @see https://docs.bale.ai/#senddocument
   */
  sendDocument(
    chatId: string | number,
    document: string | InputFile,
    options?: {
      caption?: string;
      reply_to_message_id?: string;
      reply_markup?: ReplyMarkup;
    }
  ) {
    return this.request('sendDocument', {
      chat_id: chatId,
      document: document,
      ...options,
    });
  }

  /**
   * ارسال فایل عمومی
   * @see https://docs.bale.ai/#sendvideo
   */
  sendVideo(
    chatId: string | number,
    video: string | InputFile,
    options?: {
      caption?: string;
      reply_to_message_id?: string;
      reply_markup?: ReplyMarkup;
    }
  ) {
    return this.request('sendVideo', {
      chat_id: chatId,
      video: video,
      ...options,
    });
  }

  /**
   * ارسال یک انیمیشن
   * @see https://docs.bale.ai/#sendanimation
   */
  sendAnimation(
    chatId: string | number,
    animation: string | InputFile,
    options?: {
      caption?: string;
      reply_to_message_id?: string;
      reply_markup?: ReplyMarkup;
    }
  ) {
    return this.request('sendAnimation', {
      chat_id: chatId,
      animation: animation,
      ...options,
    });
  }

  /**
   * ارسال یک صدا
   * @see https://docs.bale.ai/#sendvoice
   */
  sendVoice(
    chatId: string | number,
    voice: string | InputFile,
    options?: {
      caption?: string;
      reply_to_message_id?: string;
      reply_markup?: ReplyMarkup;
    }
  ) {
    return this.request('sendVoice', {
      chat_id: chatId,
      voice: voice,
      ...options,
    });
  }

  sendMediaGroup(
    chatId: string | number,
    media: InputMediaPayload,
    reply_to_message_id?: string
  ) {
    return this.request('sendMediaGroup', {
      chat_id: chatId,
      media: media,
      reply_to_message_id: reply_to_message_id,
    });
  }

  /**
  * ارسال موقعیت مکانی
  * @see https://docs.bale.ai/#location
  */
  sendLocation(
    chatId: string | number,
    latitude: number,
    longitude: number,
    options?: {
      horizontal_accuracy?: number;
      reply_to_message_id?: number;
      reply_markup?: ReplyMarkup;
    }
  ) {
    return this.request('sendLocation', {
      chat_id: chatId,
      latitude,
      longitude,
      horizontal_accuracy: options?.horizontal_accuracy,
      reply_to_message_id: options?.reply_to_message_id,
      reply_markup: options?.reply_markup,
    });
  }

  /**
  * ارسال یک مخاطب 
  * @see https://docs.bale.ai/#contact
  */
  sendContact(
    chatId: string | number,
    phoneNumber: string | number,
    firstName: string,
    options?: {
      lastName?: string;
      reply_to_message_id?: string;
      reply_markup?: ReplyKeyboardMarkup;
    }
  ) {
    return this.request('sendContact', {
      chat_id: chatId,
      phone_number: phoneNumber,
      first_name: firstName,
      last_name: options?.lastName,
      reply_to_message_id: options?.reply_to_message_id,
      reply_markup: options?.reply_markup,
    });
  }

  
  /**
  * برای اطلاع به کاربر در مورد اینکه عملیتاتی از سمت ربات در حال انجام است
  * @see https://docs.bale.ai/#sendchataction
  */
  sendChatAction(
    chatId: string | number,
    action: ChatActionsType
  ): Promise<boolean> {
    return this.request('sendChatAction', {
      chat_id: chatId,
      action,
    });
  }

  /**
   * دریافت یک فایل
   * @see https://docs.bale.ai/#getfile
   */
  async getFile(fileId: string): Promise<File> {
    const result = await this.request<FilePayload>('getFile', {
      file_id: fileId,
    });
    return new File(result);
  }

  /**
   *  از این متد برای پاسخ دادن به یک کال بک کويری که از طریق دکمه‌های اینلاین ارسال شده، استفاده می‌شود
   * @see https://docs.bale.ai/#answercallbackquery
   */
  answerCallbackQuery(
    callbackQueryId: string,
    options?: {
      text?: string;
      show_alert?: boolean;
    }
  ): Promise<boolean> {
    return this.request<boolean>('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text: options?.text,
      show_alert: options?.show_alert,
    });
  }

  /**
   * درخواست از کاربر جهت ثبت یا ویرایش نظر دربارهٔ بازو.
   * @see https://docs.bale.ai/#askreview
   */
  askReview(userId: number, delaySeconds: number): Promise<boolean> {
    return this.request<boolean>('askReview', {
      user_id: userId,
      delay_seconds: delaySeconds,
    });
  }

  /**
   * این متد برای مسدود کردن کاربر در یک گروه یا یک کانال استفاده می‌شود
   * @see https://docs.bale.ai/#banchatmember 
   */
  banChatMember(chatId: string | number, userId: number): Promise<boolean> {
    return this.request('banChatMember', { chat_id: chatId, user_id: userId });
  }

  /**
   * این متد جهت خارج‌ کردن یک کاربر مسدودشده از حالت مسدود در یک گروه یا کانال استفاده می‌شوند
   *  @see https://docs.bale.ai/#unbanchatmember 
   */
  unbanChatMember(
    chatId: string | number,
    userId: number,
    options?: { only_if_banned?: boolean }
  ): Promise<boolean> {
    return this.request('unbanChatMember', {
      chat_id: chatId,
      user_id: userId,
      only_if_banned: options?.only_if_banned,
    });
  }

  /**
   * این متد به منظور ارتقا یا تنزل یک کاربر در یک گروه یا کانال استفاده می‌شود
   *  @see https://docs.bale.ai/#promotechatmember
   */
  promoteChatMember(
    chatId: string | number,
    userId: number,
    options?: {
      can_change_info?: boolean;
      can_post_messages?: boolean;
      can_edit_messages?: boolean;
      can_delete_messages?: boolean;
      can_manage_video_chats?: boolean;
      can_invite_users?: boolean;
      can_restrict_members?: boolean;
    }
  ): Promise<boolean> {
    return this.request('promoteChatMember', {
      chat_id: chatId,
      user_id: userId,
      ...options,
    });
  }

  /**
   * این متد به منظور تنظیم یک تصویر پروفایل جدید برای گفتگو استفاده می‌شود
   *  @see https://docs.bale.ai/#setchatphoto
   */
  setChatPhoto(chatId: string | number, photo: InputFile): Promise<boolean> {
    return this.request('setChatPhoto', { chat_id: chatId, photo });
  }

  /** 
   * این متد برای بازو به منظور ترک یک گروه، گروه یا کانال استفاده می‌شود
   * @see https://docs.bale.ai/#leavechat 
   */
  leaveChat(chatId: string | number): Promise<boolean> {
    return this.request('leaveChat', { chat_id: chatId });
  }

  /** 
   * این متد به منظور دریافت اطلاعات به‌روز در مورد گفتگو (نام فعلی کاربر برای مکالمات یک به یک، نام کاربری فعلی یک کاربر، گروه یا کانال) استفاده می‌شود
   * @see https://docs.bale.ai/#getchat
   */
  async getChat(chatId: string | number): Promise<ChatFullInfo> {
    const result = await this.request<ChatFullInfoPayload>('getChat', {
      chat_id: chatId,
    });
    return new ChatFullInfo(result);
  }

  /** 
   * این متد به منظور دریافت لیست مدیران یک گفتگو استفاده می‌شود
   * @see https://docs.bale.ai/#getchatadministrators 
   */
  async getChatAdministrators(chatId: string | number): Promise<ChatMember[]> {
    const result = await this.request<ChatMemberPayload[]>(
      'getChatAdministrators',
      { chat_id: chatId }
    );
    return result.map(createChatMember);
  }

  /** 
   * این متد به منظور دریافت تعداد اعضای گفتگو استفاده می‌شود
   * @see https://docs.bale.ai/#getchatmemberscount 
   */
  getChatMembersCount(chatId: string | number): Promise<number> {
    return this.request('getChatMembersCount', { chat_id: chatId });
  }

  /**
   * این متد به منظور دریافت اطلاعات یکی از اعضای گفتگو (گروه یا کانال) استفاده می‌شود
   *  @see https://docs.bale.ai/#getchatmember 
   */
  async getChatMember(
    chatId: string | number,
    userId: number
  ): Promise<ChatMember> {
    const result = await this.request<ChatMemberPayload>('getChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
    return createChatMember(result);
  }

  /** 
   * با استفاده از این متد میتوانید یک پیام را به پیام های پین شده اضافه کنید. 
   * @see https://docs.bale.ai/#pinchatmessage 
   */
  pinChatMessage(chatId: string | number, messageId: number): Promise<boolean> {
    return this.request('pinChatMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  /**
   * با استفاده از این متد میتوانید یک پیام را از پیام های پین شده حذف کنید.
   *  @see https://docs.bale.ai/#unpinchatmessage
   */
  unPinChatMessage(
    chatId: string | number,
    messageId: number
  ): Promise<boolean> {
    return this.request('unPinChatMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  /**
   * با استفاده از این متد میتوانید همه پیام ها را حذف کنید.
   *  @see https://docs.bale.ai/#unpinallchatmessages
   */
  unpinAllChatMessages(chatId: string | number): Promise<boolean> {
    return this.request('unpinAllChatMessages', { chat_id: chatId });
  }

  /** 
   * با استفاده از این متد میتوان عنوان چت را تغییر داد
   * @see https://docs.bale.ai/#setchattitle
   */
  setChatTitle(chatId: string | number, title: string): Promise<boolean> {
    return this.request('setChatTitle', { chat_id: chatId, title });
  }

  /**
   * با استفاده از این متد میتوان توضیحات یک گروه یا یک کانال را تغییر داد
   * @see https://docs.bale.ai/#setchatdescription
   */
  setChatDescription(
    chatId: string | number,
    description: string
  ): Promise<boolean> {
    return this.request('setChatDescription', {
      chat_id: chatId,
      description,
    });
  }

  /** 
   * با استفاده از این متد میتوان عکس چت را حذف کرد 
   * @see https://docs.bale.ai/#deletechatphoto
   */
  deleteChatPhoto(chatId: string | number): Promise<boolean> {
    return this.request('deleteChatPhoto', { chat_id: chatId });
  }

  /** 
   * با استفاده از این متد می توان برای گروه لینک جدید ایجاد کرد.
   * @see https://docs.bale.ai/#createchatinvitelink
   */
  createChatInviteLink(chatId: string | number): Promise<unknown> {
    return this.request('createChatInviteLink', { chat_id: chatId });
  }

  /** 
   * با استفاده از این متد میتوان لینک عضویت گروه را ابطال کرد
   * @see https://docs.bale.ai/#revokechatinvitelink 
   */
  revokeChatInviteLink(
    chatId: string | number,
    inviteLink: string
  ): Promise<unknown> {
    return this.request('revokeChatInviteLink', {
      chat_id: chatId,
      invite_link: inviteLink,
    });
  }

  /**
   * .با استفاده از این متد بازو می تواند برای یک چت لینک عضویت جدید ایجاد کند در صورتی که قبلا ایجاد شده باشد ابطال و جدید ساخته می شود 
   *  @see https://docs.bale.ai/#exportchatinvitelin
   */
  exportChatInviteLink(chatId: string | number): Promise<unknown> {
    return this.request('exportChatInviteLink', { chat_id: chatId });
  }

  /** 
   * از این متد برای ویرایش پیام‌های متنی استفاده کنید.
   * @see https://docs.bale.ai/#editmessagetext 
   */
  editMessageText(
    chatId: string | number,
    messageId: number,
    text: string,
    options?: { reply_markup?: InlineKeyboardMarkup }
  ): Promise<unknown> {
    return this.request('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      reply_markup: options?.reply_markup,
    });
  }

  /**
   * از این متد برای ویرایش زیرنویس پیام‌هایی مانند عکس، ویدئو یا انیمیشن استفاده کنید.
   * @see https://docs.bale.ai/#editmessagecaption
   */
  editMessageCaption(
    chatId: string | number,
    messageId: number,
    options?: {
      caption?: string;
      reply_markup?: InlineKeyboardMarkup;
    }
  ): Promise<unknown> {
    return this.request('editMessageCaption', {
      chat_id: chatId,
      message_id: messageId,
      caption: options?.caption,
      reply_markup: options?.reply_markup,
    });
  }

  /**
   * این متد برای ویرایش صفحه‌کلید یک پیام بدون تغییر در محتوای آن استفاده کنید.
   *  @see https://docs.bale.ai/#editmessagereplymarkup 
   */
  editMessageReplyMarkup(
    chatId: string | number,
    messageId: number,
    options?: { reply_markup?: InlineKeyboardMarkup }
  ): Promise<unknown> {
    return this.request('editMessageReplyMarkup', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: options?.reply_markup,
    });
  }

  /** @see https://docs.bale.ai/#deletemessage */
  deleteMessage(chatId: string | number, messageId: number): Promise<boolean> {
    return this.request('deleteMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  /** @see https://docs.bale.ai/#uploadstickerfile */
  async uploadStickerFile(
    userId: number,
    sticker: InputFile
  ): Promise<File> {
    const result = await this.request<FilePayload>('uploadStickerFile', {
      user_id: userId,
      sticker,
    });
    return new File(result);
  }

  /** @see https://docs.bale.ai/#createnewstickerset */
  createNewStickerSet(
    userId: number,
    name: string,
    title: string,
    stickers: InputSticker[]
  ): Promise<boolean> {
    return this.request('createNewStickerSet', {
      user_id: userId,
      name,
      title,
      sticker: stickers,
    });
  }

  /** @see https://docs.bale.ai/#addstickertoset */
  addStickerToSet(
    userId: number,
    name: string,
    sticker: InputSticker
  ): Promise<boolean> {
    return this.request('addStickerToSet', {
      user_id: userId,
      name,
      sticker,
    });
  }

  /** @see https://docs.bale.ai/#sendinvoice */
  sendInvoice(
    chatId: string | number,
    title: string,
    description: string,
    payload: string,
    providerToken: string,
    prices: LabeledPrice[],
    options?: {
      photo_url?: string;
      reply_to_message_id?: number;
    }
  ): Promise<unknown> {
    return this.request('sendInvoice', {
      chat_id: chatId,
      title,
      description,
      payload,
      provider_token: providerToken,
      prices,
      photo_url: options?.photo_url,
      reply_to_message_id: options?.reply_to_message_id,
    });
  }

  /** @see https://docs.bale.ai/#createinvoicelink */
  createInvoiceLink(
    title: string,
    description: string,
    payload: string,
    providerToken: string,
    prices: LabeledPrice[]
  ): Promise<string> {
    return this.request('createInvoiceLink', {
      title,
      description,
      payload,
      provider_token: providerToken,
      prices,
    });
  }

  /** @see https://docs.bale.ai/#answerprecheckoutquery */
  answerPreCheckoutQuery(
    preCheckoutQueryId: string,
    ok: boolean,
    errorMessage?: string
  ): Promise<boolean> {
    return this.request('answerPreCheckoutQuery', {
      pre_checkout_query_id: preCheckoutQueryId,
      ok,
      error_message: errorMessage,
    });
  }

  /** @see https://docs.bale.ai/#inquiretransaction */
  async inquireTransaction(transactionId: string): Promise<Transaction> {
    const result = await this.request<TransactionPayload>(
      'inquireTransaction',
      { transaction_id: transactionId }
    );
    return new Transaction(result);
  }

  setWebhook(url: string): Promise<unknown> {
    return this.request('setWebhook', { url });
  }

  deleteWebhook(): Promise<unknown> {
    return this.request('deleteWebhook');
  }

  getWebhookInfo(): Promise<unknown> {
    return this.request('getWebhookInfo');
  }
}
