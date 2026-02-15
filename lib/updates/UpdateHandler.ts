import { EventEmitter } from 'events';
import { Message } from '../types/Message';
import { CallbackQuery } from '../types/CallbackQuery';
import type { Bot } from '../Bot';
import type { UpdatePayload } from '../types/Update';


const POLL_INTERVAL_MS = 1000;
const DEFAULT_TIMEOUT = 30;

export interface PollingOptions {
  timeout?: number;
  interval?: number;
}

interface RawUpdate {
  update_id: number;
  message?: import('../types/Message').MessagePayload;
  edited_message?: import('../types/Message').MessagePayload;
  callback_query?: import('../types/CallbackQuery').CallbackQueryPayload;
}

/**
 * Handles incoming updates: long-polling and dispatching to registered handlers.
 */
export class UpdateHandler extends EventEmitter {
  private bot: Bot;
  private polling = false;
  private offset = 0;
  private _pollTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(bot: Bot) {
    super();
    this.bot = bot;
  }

  startPolling(options: PollingOptions = {}): Promise<void> {
    if (this.polling) {
      return Promise.resolve();
    }
    this.polling = true;
    this._poll(options);
    return Promise.resolve();
  }

  stopPolling(): Promise<void> {
    this.polling = false;
    if (this._pollTimeout) {
      clearTimeout(this._pollTimeout);
      this._pollTimeout = null;
    }
    return Promise.resolve();
  }

  private _poll(options: PollingOptions = {}): void {
    if (!this.polling) return;

    const timeout = options.timeout ?? DEFAULT_TIMEOUT;

    this.bot.api
      .getUpdates({
        offset: this.offset,
        timeout,
      })
      .then((updates) => {
        const list = updates as RawUpdate[] | undefined;
        if (!Array.isArray(list)) return;
        for (const update of list) {
          this.offset = Math.max(this.offset, update.update_id + 1);
          this.processUpdate(update).catch((err) => {
            this.emit('error', err);
          });
        }
      })
      .catch((err) => {
        this.emit('error', err);
      })
      .finally(() => {
        if (this.polling) {
          this._pollTimeout = setTimeout(
            () => this._poll(options),
            options.interval ?? POLL_INTERVAL_MS
          );
        }
      });
  }

  processUpdate(update: RawUpdate | UpdatePayload): Promise<unknown[]> {
    const promises: Promise<unknown>[] = [];

    if (update.message) {
      const message =
        update.message instanceof Message
          ? update.message
          : new Message(update.message);
      (message as Message & { _bot?: Bot })._bot = this.bot;
      promises.push(Promise.resolve(this.emit('message', message)));
    }
    if (update.edited_message) {
      const message =
        update.edited_message instanceof Message
          ? update.edited_message
          : new Message(update.edited_message);
      (message as Message & { _bot?: Bot })._bot = this.bot;
      promises.push(Promise.resolve(this.emit('edited_message', message)));
    }
    if (update.callback_query) {
      const query =
        update.callback_query instanceof CallbackQuery
          ? update.callback_query
          : new CallbackQuery(update.callback_query);
      (query as CallbackQuery & { _bot?: Bot })._bot = this.bot;
      promises.push(Promise.resolve(this.emit('callback_query', query)));
    }

    return Promise.all(promises);
  }

  on(event: string, handler: (...args: unknown[]) => void): this {
    return super.on(event, handler);
  }
}
