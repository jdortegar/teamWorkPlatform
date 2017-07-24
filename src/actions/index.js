import { replace } from 'react-router-redux';

// All actions here are [flux-standard-action](https://github.com/acdlite/flux-standard-action) compliant.
export * from './auth';
export * from './subscriberOrgs';
export * from './teams';
export * from './teamRooms';
export * from './conversations';
export * from './invitations';
export * from './integrations';

export function replaceRoute(newRoute) {
  return dispatch => dispatch(replace(newRoute));
}
