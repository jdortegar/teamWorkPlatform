import { replace } from 'react-router-redux';

// All actions here are [flux-standard-action](https://github.com/acdlite/flux-standard-action) compliant.
export * from './auth';
export * from './dialogs';
export * from './subscriberOrgsFetch';
export * from './subscriberOrgReceive';
export * from './subscriberOrgSetCurrent';
export * from './subscriberOrgCreateFromDialog';
export * from './teams';
export * from './teamUpdate';
export * from './teamRooms';
export * from './conversations';
export * from './invitations';
export * from './integrations';
export * from './subscribers';
export * from './teamMembers';
export * from './teamRoomMembers';

export function replaceRoute(newRoute) {
  return dispatch => dispatch(replace(newRoute));
}
