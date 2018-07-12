export const SUBSCRIBERORG_SETCURRENT = 'subscriberOrg/setcurrent';

export const setCurrentSubscriberOrgId = subscriberOrgId => ({
  type: SUBSCRIBERORG_SETCURRENT,
  payload: subscriberOrgId
});
