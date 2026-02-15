import { Message, MessagePayload } from './Message';
import { CallbackQuery, CallbackQueryPayload } from './CallbackQuery';

export interface UpdatePayload {
  update_id: number;
  message?: MessagePayload;
  edited_message?: MessagePayload;
  callback_query?: CallbackQueryPayload;
}

/**
 * Incoming update from Bale (getUpdates or webhook payload).
 */
export class Update {
  updateId: number;
  message: Message | null;
  editedMessage: Message | null;
  callbackQuery: CallbackQuery | null;

  constructor(payload: UpdatePayload = {} as UpdatePayload) {
    this.updateId = payload.update_id;
    this.message = payload.message ? new Message(payload.message) : null;
    this.editedMessage = payload.edited_message
      ? new Message(payload.edited_message)
      : null;
    this.callbackQuery = payload.callback_query
      ? new CallbackQuery(payload.callback_query)
      : null;
  }
}
