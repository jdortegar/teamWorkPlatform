import _ from 'lodash';
import { createSelector } from 'reselect';
import {
  sortByName
} from './helpers';
import {
  getSubscriberOrgById,
  getCurrentSubscriberOrgId,
  getTeamById,
  getTeamIdsBySubscriberOrgId,
  getTeamRoomById,
  getTeamRoomIdsByTeamId
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

export const getCurrentSubscriberOrgTeamsAndTeamRooms = createSelector(
  [getCurrentSubscriberOrgId, getTeamById, getTeamIdsBySubscriberOrgId, getTeamRoomById, getTeamRoomIdsByTeamId],
  (currentSubscriberOrgId, teamById, teamIdsBySubscriberOrgId, teamRoomById, teamRoomIdsByTeamId) => {
    const teams = [];

    if ((currentSubscriberOrgId) && (teamIdsBySubscriberOrgId[currentSubscriberOrgId])) {
      for (const teamId of teamIdsBySubscriberOrgId[currentSubscriberOrgId]) { // eslint-disable-line no-restricted-syntax
        const teamRoomIds = teamRoomIdsByTeamId[teamId];
        if ((!teamRoomIds) || (teamRoomIds.length === 0)) {
          teams.length = 0; // Clear any previous retrieved teams/rooms.
          break;
        }

        const team = _.cloneDeep(teamById[teamId]);
        team.teamRooms = teamRoomIds.map(teamRoomId => _.cloneDeep(teamRoomById[teamRoomId]));
        teams.push(team);
      }
    }

    return (teams.length > 0) ? teams : undefined;
  }
);

// TODO: move this to own category.
export const getIntegrationFilesAndFolders = createSelector(
  [getCurrentSubscriberOrgId],
  (currentSubscriberOrgId) => {
    return {
      nodesById: {
        'Folder 1': {
          id: 'Folder 1',
          type: 'FOLDER',
          name: 'Folder 1',
          expanded: false,
          childNodeIds: {
            'Folder 1.1': 'Folder 1.1'
          }
        },
        'Folder 1.1': {
          id: 'Folder 1.1',
          type: 'FOLDER',
          name: 'Folder 1.1',
          expanded: false,
          childNodeIds: {
            'my.pdf': 'my.pdf'
          }
        },
        'my.pdf': {
          id: 'my.pdf',
          type: 'PDF',
          name: 'my.pdf'
        },
        'my first.pdf': {
          id: 'my first.pdf',
          type: 'PDF',
          name: 'my first.pdf'
        },
        'Folder 2': {
          id: 'Folder 2',
          type: 'FOLDER',
          name: 'Folder 2',
          expanded: false,
          childNodeIds: {
            'hello World.doc': 'hello World.doc'
          }
        },
        'hello World.doc': {
          id: 'hello World.doc',
          type: 'DOC',
          name: 'hello World.doc'
        },
        'spreadsheet.xls': {
          id: 'spreadsheet.xls',
          type: 'XLS',
          name: 'spreadsheet.xls'
        }
      },
      nodeHierarchy: [
        {
          id: 'Folder 1',
          children: [
            {
              id: 'Folder 1.1',
              children: [
                {
                  id: 'my.pdf'
                }
              ]
            },
            {
              id: 'my first.pdf'
            }
          ]
        },
        {
          id: 'Folder 2',
          children: [
            {
              id: 'hello World.doc'
            }
          ]
        },
        {
          id: 'spreadsheet.xls'
        }
      ],
      selected: {
        'my.pdf': 'some-team-id'
      }
    };
  }
);
