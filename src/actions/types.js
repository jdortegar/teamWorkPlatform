//= =====================
// Auth Actions
//= =====================
export const AUTH_USER = "auth_user",
  UNAUTH_USER = "unauth_user",
  AUTH_ERROR = "auth_error",
  FORGOT_PASSWORD_REQUEST = "forgot_password_request",
  RESET_PASSWORD_REQUEST = "reset_password_request",
  PROTECTED_TEST = "protected_test";

//= =====================
// User Profile Actions
//= =====================
export const FETCH_USER = "fetch_user",
  FETCH_PROFILE = "fetch_profile",
  UPDATE_PROFILE = "update_profile";

//= =====================
// Messaging Actions
//= =====================
export const FETCH_CONVERSATIONS = "fetch_conversations",
  FETCH_RECIPIENTS = "fetch_recipients",
  START_CONVERSATION = "start_conversation",
  FETCH_SINGLE_CONVERSATION = "fetch_single_conversation",
  CHAT_ERROR = "chat_error",
  SEND_REPLY = "send_reply";

//= =====================
// Page Actions
//= =====================
export const SEND_CONTACT_FORM = "send_contact_form",
  STATIC_ERROR = "static_error";

//= =====================
// Registration Actions
//= =====================
export const SUBMIT_FORM = "submit_form",
  FLIP_CARD = "flip_card",
  VERIFY_EMAIL = "verify_email";

//= =====================
// Customer Actions
//= =====================
export const CREATE_CUSTOMER = "create_customer",
  FETCH_CUSTOMER = "fetch_customer",
  CANCEL_SUBSCRIPTION = "cancel_subscription",
  UPDATE_BILLING = "update_billing",
  BILLING_ERROR = "billing_error",
  CHANGE_SUBSCRIPTION = "change_subscription";


//= =====================
// SubscriberOrgs Actions
//= =====================
export const REQUEST_SUBSCRIBER_ORGS = 'request_subscriber_orgs';
export const RECEIVE_SUBSCRIBER_ORGS = 'receive_subscriber_orgs';
export const REQUEST_SUBSCRIBER_ORGS_ERROR = 'request_subscriber_orgs_error';
export const SET_CURRENT_SUBSCRIBER_ORG = 'set_current_subscriber_org';
export const CREATE_SUBSCRIBER_ORG = 'create_subscriber_org';
export const SUBMITTING_ORG_FORM = 'submitting_org_form';

//= =====================
// Teams Actions
//= =====================
export const REQUEST_TEAMS = 'request_teams';
export const RECEIVE_TEAMS = 'receive_teams';
export const GET_ALL_TEAMS = 'get_all_teams';
export const REQUEST_TEAMS_ERROR = 'request_teams_error';
export const SET_CURRENT_TEAM = 'set_current_team';


//= =====================
// Team Rooms Actions
//= =====================
export const REQUEST_TEAM_ROOMS = 'request_team_rooms';
export const GET_ALL_TEAM_ROOMS = 'get_all_team_rooms';
export const RECEIVE_TEAM_ROOMS = 'receive_team_rooms';
export const REQUEST_TEAM_ROOMS_ERROR = 'request_team_rooms_error';
export const SET_CURRENT_TEAM_ROOM = 'set_current_team_room';


//= =====================
// Conversations Actions
//= =====================
export const REQUEST_CONVERSATIONS = 'request_conversations';
export const RECEIVE_CONVERSATIONS = 'receive_conversations';
export const REQUEST_CONVERSATIONS_ERROR = 'request_conversations_error';
export const REQUEST_TRANSCRIPT = 'request_transcript';
export const RECEIVE_TRANSCRIPT = 'receive_transcript';
export const REQUEST_TRANSCRIPT_ERROR = 'request_transcript_error';
export const SET_ACTIVE_CONVERSATION = 'set_active_conversation';


//= =====================
// Modal Dialogs
//= =====================
export const SHOW_TEAM_DIALOG = 'show_team_dialog';
export const SHOW_ORG_DIALOG = 'show_org_dialog';
export const SHOW_INVITE_DIALOG = 'show_invite_dialog';

//= =====================
// Integrations Actions
//= =====================
export const REQUEST_INTEGRATIONS = 'request_integrations';
export const RECEIVE_INTEGRATIONS = 'receive_integrations';
export const REQUEST_INTEGRATIONS_ERROR = 'request_integrations_error';
export const INTEGRATE_ERROR_BAD_SUBSCRIBER_ORG = 'integrate_error_bad_subscriber_org';
export const INTEGRATE_ERROR = 'integrate_error'; // Catch-all error.
// export const INTEGRATE_GOOGLE = 'integrate_google'; // Doesn't change state directly, so not needed.
// export const INTEGRATE_BOX = 'integrate_box'; // Doesn't change state directly, so not needed.
