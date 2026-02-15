import { PhotoSize, PhotoSizePayload } from '../PhotoSize';
import { Sticker, StickerPayload } from './Sticker';

export interface StickerSetPayload {
  name: string;
  title: string;
  stickers: StickerPayload[];
  thumbnail?: PhotoSizePayload;
}

export class StickerSet {
  name: string;
  title: string;
  stickers: Sticker[];
  thumbnail: PhotoSize | null;

  constructor(payload: StickerSetPayload) {
    this.name = payload.name;
    this.title = payload.title;
    this.stickers = payload.stickers.map((p) => new Sticker(p));
    this.thumbnail = payload.thumbnail ? new PhotoSize(payload.thumbnail) : null;
  }
}
