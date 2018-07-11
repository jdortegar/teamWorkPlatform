export const SUBSCRIBERORG_SETCURRENT = 'subscriberOrg/setcurrent';

export const setCurrentSubscriberOrgId = subscriberOrgId => {
  return {
    type: SUBSCRIBERORG_SETCURRENT,
    payload: subscriberOrgId
  };
};
