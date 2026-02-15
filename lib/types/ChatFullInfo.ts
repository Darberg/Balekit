import { ChatType } from './Chat';
import { ChatPhoto, ChatPhotoPayload } from './ChatPhoto';

export interface ChatFullInfoPayload {
  /**
   * شناسه یکتای چت
   * ممکن است بزرگ‌تر از 2^31 باشد.
   * حداکثر 52 بیت ارزش دارد.
   * برای ذخیره‌سازی بهتر است از int64 یا number 64bit استفاده شود.
   */
  id: number;

  /**
   * نوع چت
   * مقادیر ممکن: "private" | "group" | "channel"
   */
  type: ChatType;

  /**
   * عنوان چت
   * فقط برای گروه‌ها و کانال‌ها وجود دارد.
   */
  title?: string;

  /**
   * نام کاربری چت
   * در چت خصوصی یا کانال در صورت وجود قرار می‌گیرد.
   */
  username?: string;

  /**
   * نام کوچک کاربر طرف مقابل در چت خصوصی
   */
  first_name?: string;

  /**
   * نام خانوادگی کاربر طرف مقابل در چت خصوصی
   */
  last_name?: string;

  /**
   * عکس چت
   * شامل شناسه‌های فایل کوچک و بزرگ است.
   */
  photo?: ChatPhotoPayload;

  /**
   * بخش "درباره من" کاربر در چت خصوصی
   */
  bio?: string;

  /**
   * توضیحات گروه یا کانال
   */
  description?: string;

  /**
   * لینک دعوت گروه یا کانال
   * فقط در صورتی موجود است که ربات دسترسی داشته باشد.
   */
  invite_link?: string;

  /**
   * شناسه چت لینک‌شده (مثلاً گروه بحث متصل به کانال)
   */
  linked_chat_id?: string;
}

export class ChatFullInfo {
  id: number;
  type: ChatType;
  title: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  photo: ChatPhoto | null;
  bio: string | null;
  description: string | null;
  inviteLink: string | null;
  linkedChatId: string | null;

  constructor(payload: ChatFullInfoPayload) {
    this.id = payload.id;
    this.type = payload.type;
    this.title = payload.title ?? null;
    this.username = payload.username ?? null;
    this.firstName = payload.last_name ?? null;
    this.lastName = payload.last_name ?? null;
    this.photo = payload.photo ? new ChatPhoto(payload.photo) : null;
    this.bio = payload.bio ?? null;
    this.description = payload.description ?? null;
    this.inviteLink = payload.invite_link ?? null;
    this.linkedChatId = payload.linked_chat_id ?? null;
  }
}
