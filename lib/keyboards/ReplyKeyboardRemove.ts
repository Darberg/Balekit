/**
 * ReplyKeyboardRemove – حذف صفحه‌کلید سفارشی و نمایش صفحه‌کلید عادی.
 * @see Bale Bot API: ReplyKeyboardRemove
 */
export interface ReplyKeyboardRemoveOptions {
  selective?: boolean;
}

export class ReplyKeyboardRemove {
  remove_keyboard = true as const;
  selective: boolean;

  constructor(options: ReplyKeyboardRemoveOptions = {}) {
    this.selective = options.selective ?? false;
  }

  toJSON(): { remove_keyboard: true; selective?: boolean } {
    return {
      remove_keyboard: true,
      ...(this.selective ? { selective: true } : {}),
    };
  }
}

export function removeKeyboard(
  options?: ReplyKeyboardRemoveOptions
): ReplyKeyboardRemove {
  return new ReplyKeyboardRemove(options);
}
