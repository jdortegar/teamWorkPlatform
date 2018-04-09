import { createSelector } from 'reselect';
import {
  sortByName
} from './helpers';
import {
  getSubscriberOrgById,
  getCurrentSubscriberOrgId,
} from './state';

export {
  getSubscriberOrgById,
  getCurrentSubscriberOrgId,
  getUserIdsBySubscriberOrgId
} from './state';

/**
 * Return array of subscriberOrgs.
 */
export const getSubscriberOrgs = createSelector(
  [getSubscriberOrgById],
  (subscriberOrgById) => {
    return Object.values(subscriberOrgById);
  }
);

export const getSubscriberOrgsSortedAlphabetically = createSelector(
  [getSubscriberOrgById],
  (subscriberOrgById) => {
    const subscriberOrgsSorted = Object.values(subscriberOrgById).sort(sortByName);
    return subscriberOrgsSorted;
  }
);

export const getCurrentSubscriberOrg = createSelector(
  [getCurrentSubscriberOrgId, getSubscriberOrgById],
  (currentSubscriberOrgId, subscriberOrgById) => {
    return (currentSubscriberOrgId) ? subscriberOrgById[currentSubscriberOrgId] : null;
  }
);
