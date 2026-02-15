import { User, UserPayload } from './User';

// --- Owner ---
export interface ChatMemberOwnerPayload {
  status: 'creator';
  user: UserPayload;
}

export class ChatMemberOwner {
  readonly status = 'creator' as const;
  user: User;

  constructor(payload: ChatMemberOwnerPayload) {
    this.user = new User(payload.user);
  }
}

// --- Administrator ---
export interface ChatMemberAdministratorPayload {
  status: 'administrator';
  user: UserPayload;
  can_delete_messages?: boolean;
  can_manage_video_chats?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_post_stories?: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_pin_messages?: boolean;
}

export class ChatMemberAdministrator {
  readonly status = 'administrator' as const;
  user: User;
  canDeleteMessages: boolean;
  canManageVideoChats: boolean;
  canRestrictMembers: boolean;
  canPromoteMembers: boolean;
  canChangeInfo: boolean;
  canInviteUsers: boolean;
  canPostStories: boolean;
  canPostMessages: boolean | null;
  canEditMessages: boolean | null;
  canPinMessages: boolean | null;

  constructor(payload: ChatMemberAdministratorPayload) {
    this.user = new User(payload.user);
    this.canDeleteMessages = payload.can_delete_messages ?? false;
    this.canManageVideoChats = payload.can_manage_video_chats ?? false;
    this.canRestrictMembers = payload.can_restrict_members ?? false;
    this.canPromoteMembers = payload.can_promote_members ?? false;
    this.canChangeInfo = payload.can_change_info ?? false;
    this.canInviteUsers = payload.can_invite_users ?? false;
    this.canPostStories = payload.can_post_stories ?? false;
    this.canPostMessages = payload.can_post_messages ?? null;
    this.canEditMessages = payload.can_edit_messages ?? null;
    this.canPinMessages = payload.can_pin_messages ?? null;
  }
}

// --- Member ---
export interface ChatMemberMemberPayload {
  status: 'member';
  user: UserPayload;
}

export class ChatMemberMember {
  readonly status = 'member' as const;
  user: User;

  constructor(payload: ChatMemberMemberPayload) {
    this.user = new User(payload.user);
  }
}

// --- Restricted ---
export interface ChatMemberRestrictedPayload {
  status: 'restricted';
  user: UserPayload;
  is_member?: boolean;
  can_send_messages?: boolean;
  can_send_audios?: boolean;
  can_send_documents?: boolean;
  can_send_photos?: boolean;
  can_send_videos?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_pin_messages?: boolean;
}

export class ChatMemberRestricted {
  readonly status = 'restricted' as const;
  user: User;
  isMember: boolean;
  canSendMessages: boolean;
  canSendAudios: boolean;
  canSendDocuments: boolean;
  canSendPhotos: boolean;
  canSendVideos: boolean;
  canChangeInfo: boolean;
  canInviteUsers: boolean;
  canPinMessages: boolean;

  constructor(payload: ChatMemberRestrictedPayload) {
    this.user = new User(payload.user);
    this.isMember = payload.is_member ?? false;
    this.canSendMessages = payload.can_send_messages ?? false;
    this.canSendAudios = payload.can_send_audios ?? false;
    this.canSendDocuments = payload.can_send_documents ?? false;
    this.canSendPhotos = payload.can_send_photos ?? false;
    this.canSendVideos = payload.can_send_videos ?? false;
    this.canChangeInfo = payload.can_change_info ?? false;
    this.canInviteUsers = payload.can_invite_users ?? false;
    this.canPinMessages = payload.can_pin_messages ?? false;
  }
}

// --- Union ---
export type ChatMemberPayload =
  | ChatMemberOwnerPayload
  | ChatMemberAdministratorPayload
  | ChatMemberMemberPayload
  | ChatMemberRestrictedPayload;

export type ChatMember =
  | ChatMemberOwner
  | ChatMemberAdministrator
  | ChatMemberMember
  | ChatMemberRestricted;

/** ساخت نمونهٔ مناسب از روی payload */
export function createChatMember(payload: ChatMemberPayload): ChatMember {
  switch (payload.status) {
    case 'creator':
      return new ChatMemberOwner(payload);
    case 'administrator':
      return new ChatMemberAdministrator(payload);
    case 'member':
      return new ChatMemberMember(payload);
    case 'restricted':
      return new ChatMemberRestricted(payload);
    default:
      return new ChatMemberMember(payload as ChatMemberMemberPayload);
  }
}
