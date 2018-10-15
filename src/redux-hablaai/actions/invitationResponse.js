import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const invitationResponse = (invitationObject, typeObject) => {
  const { type, id } = typeObject;
  const requestUrl = buildApiUrl(`${type}s/replyToInvite/${id}`);

  // Passthrough data that you'll see after going through the reducer.  Typically in your mapStateToProps.
  const reduxState = {};

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'post',
      data: invitationObject
    },
    reduxState
  );
};
