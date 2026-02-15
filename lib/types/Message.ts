import { User, UserPayload } from './User';
import { Chat, ChatPayload } from './Chat';
import { MessageEntity, MessageEntityPayload } from './MessageEntity';
import { Animation, AnimationPayload } from './Animation';
import { Audio, AudioPayload } from './Audio';
import { Document, DocumentPayload } from './Document';
import { PhotoSize, PhotoSizePayload } from './PhotoSize';
import { Video, VideoPayload } from './Video';
import { Voice, VoicePayload } from './Voice';
import { Sticker, StickerPayload } from './sticker/Sticker';
import { Contact, ContactPayload } from './Contact';
import { Location, LocationPayload } from './Location';
import { Invoice, InvoicePayload } from './Invoice';
import { SuccessfulPaymentPayload } from './payment/SuccessfulPayment';

/** Minimal bot interface for Message.reply and CallbackQuery to avoid circular dependency */
export interface BotLike {
  api: {
    sendMessage(
      chatId: number,
      text: string,
      opts?: Record<string, unknown>
    ): Promise<unknown>;
    answerCallbackQuery(
      callbackQueryId: string,
      options?: { text?: string; show_alert?: boolean }
    ): Promise<boolean>;
    askReview(userId: number, delaySeconds: number): Promise<boolean>;
  };
}

export interface MessagePayload {
  message_id: number;
  from?: UserPayload;
  sender_chat?: ChatPayload;
  date: number;
  chat?: ChatPayload;
  forward_from?: UserPayload;
  forward_from_chat?: ChatPayload;
  forward_from_message_id?: number;
  forward_date?: number;
  reply_to_message?: MessagePayload;
  text?: string;
  animation?: AnimationPayload;
  caption?: string;
  photo?: PhotoSizePayload;
  sticker?: StickerPayload;
  document?: DocumentPayload;
  audio?: AudioPayload;
  video?: VideoPayload;
  voice?: VoicePayload;
  location?: LocationPayload;
  contact?: ContactPayload;
  entities?: MessageEntityPayload[];
  new_chat_members?: UserPayload[];
  left_chat_member?: UserPayload;
  invoice?: InvoicePayload;
  caption_entities?: MessageEntityPayload[];
  successful_payment?: SuccessfulPaymentPayload;
  web_app_data?: { data: string };
  reply_markup?: unknown;
}

/** Set by UpdateHandler when processing updates */
export interface MessageWithBot extends Message {
  _bot?: BotLike;
}

/**
 * Represents an incoming message from Bale.
 */
export class Message {
  messageId: number;
  from: User | null;
  senderChat: Chat | null;
  date: number;
  chat: Chat | null;
  forwardFrom: User | null;
  forwardDate: number | null;
  replyToMessage: Message | null;
  text: string | null;
  caption: string | null;
  photo: PhotoSize | null;
  document: Document | null;
  audio: Audio | null;
  video: Video | null;
  voice: Voice | null;
  location: Location | null;
  contact: Contact | null;
  sticker: Sticker | null;
  animation: Animation | null;
  entities: MessageEntity[];
  captionEntities: MessageEntity[];
  newChatMembers: User[];
  leftChatMember: User | null;
  invoice: Invoice | null;
  successfulPayment: SuccessfulPaymentPayload | null;
  webAppData: { data: string } | null;
  replyMarkup: unknown;

  /** Set by UpdateHandler; used by reply() */
  _bot?: BotLike;

  constructor(payload: MessagePayload = {} as MessagePayload) {
    this.messageId = payload.message_id;
    this.from = payload.from ? new User(payload.from) : null;
    this.senderChat = payload.sender_chat
      ? new Chat(payload.sender_chat)
      : null;
    this.date = payload.date;
    this.chat = payload.chat ? new Chat(payload.chat) : null;
    this.forwardFrom = payload.forward_from
      ? new User(payload.forward_from)
      : null;
    this.forwardDate = payload.forward_date ?? null;
    this.replyToMessage = payload.reply_to_message
      ? new Message(payload.reply_to_message)
      : null;

    this.text = payload.text ?? null;
    this.caption = payload.caption ?? null;
    this.photo = payload.photo ?? null;
    this.document = payload.document ? new Document(payload.document) : null;
    this.audio = payload.audio ? new Audio(payload.audio) : null;
    this.video = payload.video ? new Video(payload.video) : null;
    this.voice = payload.voice ? new Voice(payload.voice) : null;
    this.location = payload.location ? new Location(payload.location) : null;
    this.contact = payload.contact ? new Contact(payload.contact) : null;
    this.sticker = payload.sticker ? new Sticker(payload.sticker) : null;
    this.animation = payload.animation
      ? new Animation(payload.animation)
      : null;

    this.entities = payload.entities
      ? payload.entities.map((e) => new MessageEntity(e))
      : [];
    this.captionEntities = payload.caption_entities
      ? payload.caption_entities.map((e) => new MessageEntity(e))
      : [];

    this.newChatMembers = payload.new_chat_members
      ? payload.new_chat_members.map((u) => new User(u))
      : [];
    this.leftChatMember = payload.left_chat_member
      ? new User(payload.left_chat_member)
      : null;

    this.invoice = payload.invoice ? new Invoice(payload.invoice) : null;
    this.successfulPayment = payload.successful_payment ?? null;
    this.webAppData = payload.web_app_data ?? null;

    this.replyMarkup = payload.reply_markup ?? null;
  }

  get chatId(): number | null {
    return this.chat ? this.chat.id : null;
  }

  get username(): string | null {
    return this.from ? this.from.username : null;
  }

  get formatedDate() {
    return new Date(this.date * 1000);
  }

  /**
   * Reply to this message. Uses bot attached by UpdateHandler, or pass bot as first arg.
   */
  async reply(
    botOrText: BotLike | string,
    text?: string,
    options: SendMessageOptions = {}
  ): Promise<unknown> {
    const bot =
      this._bot ?? (typeof botOrText === 'object' ? botOrText : undefined);
    const replyText = typeof botOrText === 'string' ? botOrText : text!;
    const opts =
      typeof botOrText === 'string'
        ? text && typeof text === 'object'
          ? (text as unknown as SendMessageOptions)
          : {}
        : options;
    if (!bot?.api) {
      throw new Error(
        'Message.reply requires a Bot instance (or use message with bot.startPolling())'
      );
    }
    return bot.api.sendMessage(this.chatId!, replyText, {
      reply_to_message_id: this.messageId,
      ...opts,
    });
  }
}

export interface SendMessageOptions {
  parse_mode?: string;
  reply_to_message_id?: number;
  reply_markup?: unknown;
  [key: string]: unknown;
}
