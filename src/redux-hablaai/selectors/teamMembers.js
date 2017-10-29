import createCachedSelector from 're-reselect';
import {
  getUsersByUserId,
  getUserIdsByTeamId
} from './state';

export {
  getTeamMemberIdByUserId,
  getUserIdsByTeamId
} from './state';

export const getTeamMembersOfTeamId = createCachedSelector( // eslint-disable-line import/prefer-default-export
  [getUserIdsByTeamId, getUsersByUserId, (state, teamId) => teamId],
  (userIdsByTeamId, usersByUserId, teamId) => {
    if ((!teamId) || (!userIdsByTeamId[teamId])) {
      return [];
    }

    const userIds = userIdsByTeamId[teamId];
    return Object.keys(userIds).map(userId => usersByUserId[userId]);
  }
)(
  (state, teamId) => teamId
);
