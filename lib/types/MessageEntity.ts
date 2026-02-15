export interface MessageEntityPayload {
  /**
   * نوع بخش از پیام
   * در حال حاضر معمولاً یکی از:
   * "mention" | "bot_command"
   */
  type: 'mention' | 'bot_command';

  /**
   * موقعیت شروع این بخش در متن پیام
   * بر حسب واحدهای UTF-16 محاسبه می‌شود.
   */
  offset: number;

  /**
   * طول این بخش در متن پیام
   * بر حسب واحدهای UTF-16 محاسبه می‌شود.
   */
  length: number;
}

export class MessageEntity {
  type: 'mention' | 'bot_command';
  offset: number;
  length: number;

  constructor(payload: MessageEntityPayload) {
    this.type = payload.type;
    this.offset = payload.offset;
    this.length = payload.length;
  }

  static fromArray(payloads: MessageEntityPayload[]): MessageEntity[] {
    return payloads.map((p) => new MessageEntity(p));
  }
}
