import Cookie from 'js-cookie';
import _ from 'lodash';

const SAVE_COOKIES = 'cookies/save';
export const LAST_ROUTE = 'lastRoute';
export const LAST_SUBSCRIBER_ORG_ID = 'lastSubscriberOrgId';

const getFromCookies = cookieName => userId => {
  const id = `${cookieName}__${userId}`;
  const value = Cookie.get(id);
  Cookie.remove(id);

  if (value === 'null') return null;
  return value;
};

export const getLastRouteCookie = getFromCookies(LAST_ROUTE);

export const getLastSubscriberOrgIdCookie = getFromCookies(LAST_SUBSCRIBER_ORG_ID);

const saveCookie = userId => (value, name) => {
  Cookie.set(`${name}__${userId}`, value, { expires: 7 });
};

export const saveCookies = () => {
  return (dispatch, getState) => {
    const { auth, subscriberOrgs, router } = getState();
    const { userId } = auth.user;
    const { currentSubscriberOrgId } = subscriberOrgs;
    const { pathname, search } = router.location;

    const cookies = {
      [LAST_ROUTE]: `${pathname}${search}`,
      [LAST_SUBSCRIBER_ORG_ID]: currentSubscriberOrgId
    };
    _.map(cookies, saveCookie(userId));

    dispatch({ type: SAVE_COOKIES, payload: cookies });
  };
};
