import { createSelector } from 'reselect';
import {
  getUserByUserId,
  getMyselfUserId
} from './state';

export {
  getUserByUserId,
  getMyselfUserId,
  getPresencesByUserId
} from './state';

export const getCurrentUser = createSelector(
  [getUserByUserId, getMyselfUserId],
  (userByUserId, myselfUserId) => {
    return userByUserId[myselfUserId];
  }
);
