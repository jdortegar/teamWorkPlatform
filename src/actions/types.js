//= =====================
// Registration Actions
//= =====================
export const SUBMIT_REGISTRATION_FORM = 'submit_registration_form';
// TODO: is this needed? export const FLIP_CARD = 'flip_card';
// TODO: is this needed? export const VERIFY_EMAIL = 'verify_email';

//= =====================
// Auth Actions
//= =====================
export const AUTH_USER = 'auth_user';
export const UNAUTH_USER = 'unauth_user';
export const LOGGING_IN = 'logging_in';

//= =====================
// User Profile Actions
//= =====================
// TODO: is this needed?  export const FETCH_USER = 'fetch_user';

//= =====================
// SubscriberOrgs Actions
//= =====================
export const REQUESTING_SUBSCRIBER_ORGS = 'requesting_subscriber_orgs';
export const RECEIVE_SUBSCRIBER_ORGS = 'receive_subscriber_orgs';
export const RECEIVE_SUBSCRIBER_ORG = 'receive_subscriber_org';
export const REQUEST_SUBSCRIBER_ORGS_ERROR = 'request_subscriber_orgs_error';
export const SET_CURRENT_SUBSCRIBER_ORG_ID = 'set_current_subscriber_org_id';
export const CREATE_SUBSCRIBER_ORG = 'create_subscriber_org';
export const SHOW_INVITE_DIALOG = 'show_invite_dialog';
export const SHOW_ORG_DIALOG = 'show_org_dialog';
export const SHOW_ORG_SETTINGS_DIALOG = 'show_org_settings_dialog';
export const SUBMITTING_ORG_FORM = 'submitting_org_form';
export const SUBMITTING_INVITE_ORG_FORM = 'submitting_invite_org_form';
export const SET_CURRENT_DIALOG_ORG_ID = 'set_current_dialog_org_id';

//= =====================
// Subscribers Actions
//= =====================
export const REQUESTING_SUBSCRIBERS = 'requesting_subscribers';
export const RECEIVE_SUBSCRIBERS = 'receive_subscribers';
export const REQUEST_SUBSCRIBERS_ERROR = 'request_subscribers_error';

//= =====================
// Invitation Actions
//= =====================
export const RECEIVE_INVITATION = 'receive_invitation';

//= =====================
// Teams Actions
//= =====================
export const REQUESTING_TEAMS = 'request_teams';
export const RECEIVE_ALL_TEAMS = 'receive_all_teams';
export const RECEIVE_TEAMS = 'receive_teams';
export const RECEIVE_TEAM = 'receive_team';
export const REQUEST_TEAMS_ERROR = 'request_teams_error';
export const SET_CURRENT_TEAM_ID = 'set_current_team_id';
export const SHOW_TEAM_DIALOG = 'show_team_dialog';
export const SUBMITTING_TEAM_FORM = 'submitting_team_form';
export const SET_CURRENT_DIALOG_TEAM_ID = 'set_current_dialog_team_id';

//= =====================
// Team Members Actions
//= =====================
export const REQUESTING_TEAM_MEMBERS = 'requesting_team_members';
export const RECEIVE_TEAM_MEMBERS = 'receive_team_members';
export const REQUEST_TEAM_MEMBERS_ERROR = 'request_team_members_error';

//= =====================
// Team Rooms Actions
//= =====================
export const REQUESTING_TEAM_ROOMS = 'requesting_team_rooms';
export const RECEIVE_ALL_TEAM_ROOMS = 'receive_all_team_rooms';
export const RECEIVE_TEAM_ROOMS = 'receive_team_rooms';
export const RECEIVE_TEAM_ROOM = 'receive_team_room';
export const REQUEST_TEAM_ROOMS_ERROR = 'request_team_rooms_error';
export const SET_CURRENT_TEAM_ROOM_ID = 'set_current_team_room_id';
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
// export const INTEGRATE_GOOGLE = 'integrate_google'; // Doesn't change state directly, so not needed.
// export const INTEGRATE_BOX = 'integrate_box'; // Doesn't change state directly, so not needed.
export const INVITE_NEW_MEMBERS = 'invite_new_members';
