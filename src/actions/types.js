//= =====================
// Registration Actions
//= =====================
export const SUBMIT_REGISTRATION_FORM = 'submit_registration_form';

//= =====================
// Auth Actions
//= =====================
export const AUTH_USER = 'auth_user';
export const UNAUTH_USER = 'unauth_user';
export const LOGGING_IN = 'logging_in';

//= =====================
// SubscriberOrgs Actions
//= =====================
export const SHOW_INVITE_DIALOG = 'show_invite_dialog';
export const SHOW_ORG_DIALOG = 'show_org_dialog';
export const SHOW_ORG_SETTINGS_DIALOG = 'show_org_settings_dialog';
export const SUBMITTING_ORG_FORM = 'submitting_org_form';
export const SUBMITTING_INVITE_ORG_FORM = 'submitting_invite_org_form';
export const SET_CURRENT_DIALOG_ORG_ID = 'set_current_dialog_org_id';

//= =====================
// Invitation Actions
//= =====================
export const RECEIVE_INVITATION = 'receive_invitation';
export const UPDATE_INVITATION = 'update_invitation';

//= =====================
// Teams Actions
//= =====================
export const SHOW_TEAM_DIALOG = 'show_team_dialog';
export const SUBMITTING_TEAM_FORM = 'submitting_team_form';
export const SET_CURRENT_DIALOG_TEAM_ID = 'set_current_dialog_team_id';

//= =====================
// Team Rooms Actions
//= =====================
export const SHOW_TEAM_ROOM_DIALOG = 'show_team_room_dialog';
export const SUBMITTING_TEAM_ROOM_FORM = 'submitting_team_room_form';

//= =====================
// Team Room Members Actions
//= =====================
export const REQUESTING_TEAM_ROOM_MEMBERS = 'requesting_team_room_members';
export const RECEIVE_TEAM_ROOM_MEMBERS = 'receive_team_room_members';
export const REQUEST_TEAM_ROOM_MEMBERS_ERROR = 'request_team_room_members_error';

//= =====================
// Conversations Actions
//= =====================
export const REQUESTING_CONVERSATIONS = 'requesting_conversations';
export const RECEIVE_CONVERSATIONS = 'receive_conversations';
export const REQUEST_CONVERSATIONS_ERROR = 'request_conversations_error';
export const REQUESTING_TRANSCRIPT = 'requesting_transcript';
export const RECEIVE_TRANSCRIPT = 'receive_transcript';
export const RECEIVE_MESSAGES = 'receive_messages';
export const NOTIFY_MESSAGE = 'notify_message';
export const REQUEST_TRANSCRIPT_ERROR = 'request_transcript_error';
export const SET_ACTIVE_CONVERSATION = 'set_active_conversation';

//= =====================
// Integrations Actions
//= =====================
export const REQUESTING_INTEGRATIONS = 'requesting_integrations';
export const RECEIVE_INTEGRATIONS = 'receive_integrations';
export const RECEIVE_REVOKE_INTEGRATION = 'receive_revoke_integration';
export const REQUEST_INTEGRATIONS_ERROR = 'request_integrations_error';
export const INTEGRATE_ERROR_BAD_SUBSCRIBER_ORG = 'integrate_error_bad_subscriber_org';
export const INTEGRATE_ERROR = 'integrate_error'; // Catch-all error.
export const INVITE_NEW_MEMBERS = 'invite_new_members';
