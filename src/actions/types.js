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
// Integrations Actions
//= =====================
// TODO: ANT:
export const INTEGRATE_ERROR_BAD_SUBSCRIBER_ORG = 'integrate_error_bad_subscriber_org';
export const INTEGRATE_ERROR = 'integrate_error'; // Catch-all error.
