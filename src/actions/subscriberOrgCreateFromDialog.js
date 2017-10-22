import { createSubscriberOrg } from './subscriberOrgCreate';
import { SUBMITTING_ORG_FORM } from './types';

export const createSubscriberOrgFromDialog = (createObject, getKey) => { // eslint-disable-line import/prefer-default-export
  return (dispatch) => {
    dispatch({ type: SUBMITTING_ORG_FORM, payload: true });
    return dispatch(createSubscriberOrg(createObject, getKey))
      .then((response) => {
        dispatch({ type: SUBMITTING_ORG_FORM, payload: false });
        return response;
      })
      .catch((err) => {
        dispatch({ type: SUBMITTING_ORG_FORM, payload: false });
        throw err;
      });
  };
};
