import config from 'config/env';
import { doAuthenticatedRequest } from './urlRequest';

export const invitationResponse = (invitationObject, typeObject) => { // eslint-disable-line import/prefer-default-export
// requestUrl is the key into redux state.urlRequests.
  const { type, id } = typeObject;
  const requestUrl = `${config.hablaApiBaseUri}/${type}s/replyToInvite/${id}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in your mapStateToProps.
  const reduxState = { };

  return doAuthenticatedRequest({
    requestUrl,
    method: 'post',
    data: invitationObject
  }, reduxState);
};
