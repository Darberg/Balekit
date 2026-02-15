/**
 * BaleKit – A library for creating bots in the Bale messenger.
 * Bale is a messaging platform (similar to Telegram); this library wraps its Bot API.
 *
 * @example
 * import { Bot } from 'balekit';
 * const bot = new Bot(process.env.BALE_TOKEN!);
 *
 * bot.onMessage(async (message) => {
 *   await message.reply('Hello!');
 * });
 *
 * bot.startPolling();
 */

export { Bot, type BotOptions } from './lib/Bot';
export { BaleError, BaleApiError } from './lib/errors';
export { BALE_API_BASE, defaultPolling } from './lib/config';
export type {
  User,
  UserPayload,
  Chat,
  ChatType,
  ChatPayload,
  Message,
  MessagePayload,
  MessageWithBot,
  SendMessageOptions,
  BotLike,
  CallbackQuery,
  CallbackQueryPayload,
  CallbackQueryWithBot,
  Update,
  UpdatePayload,
} from './lib/types';
export {
  ReplyKeyboardMarkup,
  keyboard,
  InlineKeyboardMarkup,
  inlineKeyboard,
  ReplyKeyboardRemove,
  removeKeyboard,
} from './lib/keyboards';
export type {
  ReplyKeyboardOptions,
  KeyboardButtonPayload,
  KeyboardButtonInput,
  InlineKeyboardButtonPayload,
  InlineKeyboardButtonInput,
  ReplyKeyboardRemoveOptions,
  WebAppInfo,
  CopyTextButton,
} from './lib/keyboards';

export {
  FILE_SEND_CONFIG,
  FILE_SEND_SUMMARY,
  isFileUrl,
  getFileSource,
  MAX_IMAGE_SIZE_BY_URL_BYTES,
  MAX_OTHER_SIZE_BY_URL_BYTES,
  MAX_IMAGE_SIZE_MULTIPART_BYTES,
  MAX_OTHER_SIZE_MULTIPART_BYTES,
  MAX_VOICE_SIZE_BY_URL_BYTES,
  VOICE_AS_DOCUMENT_THRESHOLD_BYTES,
  RECOMMENDED_MIME_SEND_AUDIO,
  REQUIRED_MIME_SEND_VOICE,
  DOCUMENT_URL_ALLOWED_TYPES,
  FILE_ID_RULES,
  URL_SEND_RULES,
} from './lib/files';
export type {
  FileInput,
  FileSource,
  DocumentUrlAllowedType,
} from './lib/files';
