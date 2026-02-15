import { ApiClient } from './api/Client';
import { PollingOptions, UpdateHandler } from './updates/UpdateHandler';
import { BaleError } from './errors';
import type { Message } from './types/Message';
import type { CallbackQuery } from './types/CallbackQuery';
import { User, UserPayload } from './types';
import { ReplyKeyboardMarkup } from './keyboards';
import { ReplyMarkup } from './keyboards/types';

const BALE_API_BASE = 'https://tapi.bale.ai/bot';

export interface BotOptions {
  apiBase?: string;
}

/**
 * BaleKit Bot – main entry for creating Bale messenger bots.
 * Similar to Telegram Bot API; supports long-polling and webhook.
 */
export class Bot {
  readonly token: string;
  readonly options: { apiBase: string; [key: string]: unknown };
  readonly api: ApiClient;
  readonly updateHandler: UpdateHandler;

  constructor(token: string, options: BotOptions = {}) {
    if (!token || typeof token !== 'string') {
      throw new BaleError('Bot token is required');
    }
    this.token = token;
    this.options = {
      apiBase: options.apiBase ?? BALE_API_BASE,
      ...options,
    };
    this.api = new ApiClient(this.token, this.options.apiBase as string);
    this.updateHandler = new UpdateHandler(this);
  }

  /** Start the bot using long-polling (getUpdates). */
  startPolling(options: PollingOptions = {}): Promise<void> {
    return this.updateHandler.startPolling(options);
  }

  /** Stop long-polling. */
  stopPolling(): Promise<void> {
    return this.updateHandler.stopPolling();
  }

  /**
   * Handle incoming updates (for webhook mode). Call this from your HTTP server.
   */
  handleUpdate(
    update: import('./types/Update').UpdatePayload
  ): Promise<unknown[]> {
    return this.updateHandler.processUpdate(update);
  }

  getMe(): Promise<User> {
    return this.api.getMe();
  }

  getUpdates(params: Record<string, unknown> = {}): Promise<unknown> {
    return this.api.getUpdates(
      params as import('./api/Client').GetUpdatesParams
    );
  }

  sendMessage(
    chatId: number,
    text: string,
    options?: {
      reply_to_message_id?: number,
      reply_markup?: ReplyMarkup
    }
  ): Promise<unknown> {
    return this.api.sendMessage(chatId, text, options);
  }

  forwardMessage(
    chatId: number,
    fromChatId: number,
    messageId: number
  ): Promise<unknown> {
    return this.api.forwardMessage(chatId, fromChatId, messageId);
  }

  on(event: string, handler: (...args: unknown[]) => void): this {
    this.updateHandler.on(event, handler);
    return this;
  }

  onMessage(handler: (message: Message) => void | Promise<void>): this {
    return this.on('message', handler as (...args: unknown[]) => void);
  }

  onCallbackQuery(
    handler: (query: CallbackQuery) => void | Promise<void>
  ): this {
    return this.on('callback_query', handler as (...args: unknown[]) => void);
  }

  onEditedMessage(handler: (message: Message) => void | Promise<void>): this {
    return this.on('edited_message', handler as (...args: unknown[]) => void);
  }

  
}
