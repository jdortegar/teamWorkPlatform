import config from '../config/env';
import { doAuthenticatedRequest } from './urlRequest';

const responseFunction = (response) => {
  console.log(response);
  return response;
};
const errFunction = (err) => {
  console.log(err);
  throw err;
};

export const updateTeam = (updateObject, teamId, getKey) => { // eslint-disable-line import/prefer-default-export
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teams/updateTeam/${teamId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { updateObject, teamId };

  return doAuthenticatedRequest({
    requestUrl,
    method: 'patch',
    data: updateObject, // Optional.
    responseFunction, // Optional.
    errFunction // Optional.
  }, reduxState, getKey);
};
