import { User, UserPayload } from './User';
import { Message, MessagePayload } from './Message';

export interface CallbackQueryPayload {
  id: string;
  from?: UserPayload;
  message?: MessagePayload;
  inline_message_id?: string;
  chat_instance?: string;
  data?: string;
}

/** Set by UpdateHandler */
export interface CallbackQueryWithBot extends CallbackQuery {
  _bot?: import('./Message').BotLike;
}

/**
 * Incoming callback query from an inline keyboard button.
 */
export class CallbackQuery {
  id: string;
  from: User | null;
  message: Message | null;
  inlineMessageId: string | null;
  chatInstance: string | null;
  data: string | null;

  _bot?: import('./Message').BotLike;

  constructor(payload: CallbackQueryPayload = {} as CallbackQueryPayload) {
    this.id = payload.id;
    this.from = payload.from ? new User(payload.from) : null;
    this.message = payload.message ? new Message(payload.message) : null;
    this.inlineMessageId = payload.inline_message_id ?? null;
    this.chatInstance = payload.chat_instance ?? null;
    this.data = payload.data ?? null;
  }

  get chatId(): number | null {
    return this.message?.chat ? this.message.chat.id : null;
  }

  /**
   * پاسخ به این callback query (اعلان یا هشدار به کاربر و خروج دکمه از حالت انتظار).
   * اگر callback_query_id با "1" آغاز شود، کلاینت کاربر قدیمی است و این قابلیت پشتیبانی نمی‌شود.
   * @see https://docs.bale.ai/#answercallbackquery
   */
  async answerCallbackQuery(options?: {
    text?: string;
    show_alert?: boolean;
  }): Promise<boolean> {
    if (!this._bot?.api.answerCallbackQuery) {
      throw new Error('Bot not attached to this CallbackQuery');
    }
    return this._bot.api.answerCallbackQuery(this.id, options);
  }

  /**
   * درخواست ثبت یا ویرایش نظر دربارهٔ بازو برای کاربر فرستندهٔ این callback.
   * از آبان ۱۴۰۴ در نسخه‌های جدید کلاینت بله در دسترس است.
   * @see https://docs.bale.ai/#askreview
   */
  async askReview(delaySeconds: number): Promise<boolean> {
    if (!this._bot?.api.askReview) {
      throw new Error('Bot not attached to this CallbackQuery');
    }
    const userId = this.from?.id;
    if (userId == null) {
      throw new Error('CallbackQuery has no from user id');
    }
    return this._bot.api.askReview(userId, delaySeconds);
  }
}
