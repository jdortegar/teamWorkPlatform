import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import {
  getTeamRoomById,
  getTeamRoomIdsByTeamId
} from './state';
import {
  sortByName,
  primaryAtTop
} from './helpers';

export {
  getTeamRoomById,
  getTeamRoomIdsByTeamId
} from './state';

export const getTeamRooms = createSelector(
  [getTeamRoomById],
  (teamRoomById) => {
    return Object.values(teamRoomById);
  }
);

/**
 * Return array of team rooms given a teamId.
 *
 * @type {OutputSelector<any, any, (res: any) => any> & {getMatchingSelector: ((null: any, ...null: any[]) => OutputSelector<any, any, (res: any) => any>); removeMatchingSelector: ((null: any, ...null: any[]) => void); clearCache: (() => void); resultFunc: ((res: any) => any)}}
 */
export const getTeamRoomsOfTeamId = createCachedSelector(
  [getTeamRoomIdsByTeamId, getTeamRoomById, (state, teamId) => teamId],
  (teamRoomIdsByTeamId, teamRoomById, teamId) => {
    if ((!teamId) || (!teamRoomIdsByTeamId[teamId])) {
      return [];
    }

    const teamRoomIds = teamRoomIdsByTeamId[teamId];
    return teamRoomIds.map(teamRoomId => teamRoomById[teamRoomId]);
  }
)(
  (state, teamId) => teamId
);

export const getTeamRoomsOfTeamIdSortedAlphabetically = createCachedSelector(
  [getTeamRoomIdsByTeamId, getTeamRoomById, (state, teamId) => teamId],
  (teamRoomIdsByTeamId, teamRoomById, teamId) => {
    if ((!teamId) || (!teamRoomIdsByTeamId[teamId])) {
      return [];
    }

    const teamRoomIds = teamRoomIdsByTeamId[teamId];

    let teamRooms = teamRoomIds.map(teamRoomId => teamRoomById[teamRoomId]);
    teamRooms.sort(sortByName); // sorted
    teamRooms = primaryAtTop(teamRooms);
    return teamRooms;
  }
)(
  (state, teamId) => teamId
);
