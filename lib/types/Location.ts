export interface LocationPayload {
  /**
   * طول جغرافیایی
   */
  longitude: number;

  /**
   * عرض جغرافیایی
   */
  latitude: number;
}

export class Location {
  longitude: number;
  latitude: number;

  constructor(payload: LocationPayload) {
    this.latitude = payload.latitude;
    this.longitude = payload.longitude;
  }
}
