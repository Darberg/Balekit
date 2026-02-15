/**
 * تصویر گفتگو (پروفایل چت).
 * small: ۱۶۰×۱۶۰، big: ۶۴۰×۶۴۰.
 */
export interface ChatPhotoPayload {
  small_file_id: string;
  small_file_unique_id: string;
  big_file_id: string;
  big_file_unique_id: string;
}

export class ChatPhoto {
  smallFileId: string;
  smallFileUniqueId: string;
  bigFileId: string;
  bigFileUniqueId: string;

  constructor(payload: ChatPhotoPayload) {
    this.smallFileId = payload.small_file_id;
    this.smallFileUniqueId = payload.small_file_unique_id;
    this.bigFileId = payload.big_file_id;
    this.bigFileUniqueId = payload.big_file_unique_id;
  }
}
