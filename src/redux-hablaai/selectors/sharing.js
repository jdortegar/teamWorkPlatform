import _ from 'lodash';
import { createSelector } from 'reselect';
import {
  getCurrentSubscriberOrgId,
  getTeamById,
  getTeamIdsBySubscriberOrgId,
  getTeamRoomById,
  getTeamRoomIdsByTeamId
} from './state';

export const getCurrentSubscriberOrgTeamsAndTeamRooms = createSelector(
  [getCurrentSubscriberOrgId, getTeamById, getTeamIdsBySubscriberOrgId, getTeamRoomById, getTeamRoomIdsByTeamId],
  (currentSubscriberOrgId, teamById, teamIdsBySubscriberOrgId, teamRoomById, teamRoomIdsByTeamId) => {
    const ret = {
      nodesById: {},
      nodeHierarchy: []
    };

    if ((currentSubscriberOrgId) && (teamIdsBySubscriberOrgId[currentSubscriberOrgId])) {
      for (const teamId of teamIdsBySubscriberOrgId[currentSubscriberOrgId]) { // eslint-disable-line no-restricted-syntax
        const teamRoomIds = teamRoomIdsByTeamId[teamId];
        if ((!teamRoomIds) || (teamRoomIds.length === 0)) {
          ret.nodeHierarchy.length = 0; // Clear any previous retrieved teams/rooms.
          break;
        }

        const team = _.cloneDeep(teamById[teamId]);
        team.type = 'TEAM';
        team.childNodeIds = {};
        ret.nodesById[teamId] = team;
        const hierarchyTeam = {
          id: team.teamId,
          children: []
        };
        ret.nodeHierarchy.push(hierarchyTeam);
        teamRoomIds.forEach((teamRoomId) => {
          const teamRoom = _.cloneDeep(teamRoomById[teamRoomId]);
          teamRoom.type = 'TEAMROOM';
          team.childNodeIds[teamRoomId] = teamRoomId;
          ret.nodesById[teamRoomId] = teamRoom;
          hierarchyTeam.children.push({ id: teamRoomId });
        });
      }
    }

    return (ret.nodeHierarchy.length > 0) ? ret : undefined;
  }
);

export const SharingTypes = Object.freeze({
  ALL: 'ALL',
  SOME: 'SOME',
  NONE: 'NONE'
});

export const getIntegrationFilesAndFolders = createSelector(
  [getCurrentSubscriberOrgId],
  (currentSubscriberOrgId) => { // eslint-disable-line no-unused-vars
    return {
      share: SharingTypes.SOME,
      nodesById: {
        'Folder 1': {
          id: 'Folder 1',
          type: 'FOLDER',
          name: 'Folder 1',
          expanded: false,
          childNodeIds: {
            'Folder 1.1': 'Folder 1.1'
          },
          share: SharingTypes.NONE
        },
        'Folder 1.1': {
          id: 'Folder 1.1',
          type: 'FOLDER',
          name: 'Folder 1.1',
          expanded: false,
          childNodeIds: {
            'my.pdf': 'my.pdf'
          },
          share: SharingTypes.NONE
        },
        'my.pdf': {
          id: 'my.pdf',
          type: 'PDF',
          name: 'my.pdf',
          share: SharingTypes.SOME,
          shareWithIds: {
            '0ac5d3d5-689f-4137-af05-20435ce1ba35': '0ac5d3d5-689f-4137-af05-20435ce1ba35'
          }
        },
        'my first.pdf': {
          id: 'my first.pdf',
          type: 'PDF',
          name: 'my first.pdf',
          share: SharingTypes.NONE
        },
        'Folder 2': {
          id: 'Folder 2',
          type: 'FOLDER',
          name: 'Folder 2',
          expanded: false,
          childNodeIds: {
            'hello World.doc': 'hello World.doc'
          },
          share: SharingTypes.NONE
        },
        'hello World.doc': {
          id: 'hello World.doc',
          type: 'DOC',
          name: 'hello World.doc',
          share: SharingTypes.NONE
        },
        'spreadsheet.xls': {
          id: 'spreadsheet.xls',
          type: 'XLS',
          name: 'spreadsheet.xls',
          share: SharingTypes.NONE
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
      shareWithIds: {
        '0ac5d3d5-689f-4137-af05-20435ce1ba35': {
          'my.pdf': SharingTypes.ALL
        }
      }
    };
  }
);
