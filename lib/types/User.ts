export interface UserPayload {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

/**
 * Represents a Bale user (or bot).
 */
export class User {
  id: number;
  isBot: boolean;
  firstName: string;
  lastName: string | null;
  username: string | null;
  languageCode: string | null;

  constructor(payload: UserPayload = {} as UserPayload) {
    this.id = payload.id;
    this.isBot = payload.is_bot ?? false;
    this.firstName = payload.first_name ?? '';
    this.lastName = payload.last_name ?? null;
    this.username = payload.username ?? null;
    this.languageCode = payload.language_code ?? null;
  }

  get name(): string {
    const parts = [this.firstName, this.lastName].filter(Boolean);
    return parts.join(' ').trim() || 'Unknown';
  }
}
