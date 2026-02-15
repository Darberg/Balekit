export type ChatType = 'private' | 'group' | 'channel';

export interface ChatPayload {
  id: number;
  type?: ChatType;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo?: unknown;
  description?: string;
  invite_link?: string;
}

/**
 * Represents a Bale chat (private, group, channel, etc.).
 */
export class Chat {
  id: number;
  type: ChatType;
  title: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  photo: unknown;
  description: string | null;
  inviteLink: string | null;

  constructor(payload: ChatPayload = {} as ChatPayload) {
    this.id = payload.id;
    this.type = payload.type ?? 'private';
    this.title = payload.title ?? null;
    this.username = payload.username ?? null;
    this.firstName = payload.first_name ?? null;
    this.lastName = payload.last_name ?? null;
    this.photo = payload.photo ?? null;
    this.description = payload.description ?? null;
    this.inviteLink = payload.invite_link ?? null;
  }

  get isPrivate(): boolean {
    return this.type === 'private';
  }

  get isGroup(): boolean {
    return this.type === 'group';
  }

  get isChannel(): boolean {
    return this.type === 'channel';
  }
}
