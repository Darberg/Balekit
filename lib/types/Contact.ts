export interface ContactPayload {
  /**
   * شماره تماس مخاطب
   */
  phone_number: string;

  /**
   * نام کوچک مخاطب
   */
  first_name: string;

  /**
   * نام خانوادگی مخاطب
   * اختیاری
   */
  last_name?: string;

  /**
   * شناسه کاربری مخاطب در بله
   * اختیاری، 32 بیت ارزش دارد
   */
  user_id?: number;
}

export class Contact {
  phoneNumber: string;
  firstName: string;
  lastName: string | null;
  userId: number | null;

  constructor(payload: ContactPayload) {
    this.phoneNumber = payload.phone_number;
    this.firstName = payload.first_name;
    this.lastName = payload.last_name ?? null;
    this.userId = payload.user_id ?? null;
  }
}
