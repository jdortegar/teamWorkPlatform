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
        team.id = team.teamId;
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
          teamRoom.id = teamRoom.teamRoomId;
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

class ShareWithIds {
  _shareWithIds;

  constructor(shareWithIds) {
    this._shareWithIds = shareWithIds;
  }

  getShares(id) {
    return this._shareWithIds[id];
  }

  _delete(id1, id2) {
    const share1 = this._shareWithIds[id1];
    if (share1) {
      const share2 = share1[id2];
      if (share2) {
        delete share1[id2];
      }
      if (Object.keys(share1).length === 0) {
        delete this._shareWithIds[id1];
      }
    }
  }

  getSharingType(id1, id2) {
    let shareType = SharingTypes.NONE;
    const share1 = this._shareWithIds[id1];
    if (share1) {
      if (share1[id2]) {
        shareType = share1[id2];
      } else if (Object.keys(share1).length > 0) {
        shareType = SharingTypes.SOME;
      }
    }
    return shareType;
  }

  deleteShare(id1, id2) {
    console.log(`\nAD: deleteShare(${id1}, ${id2})`);
    console.log(`AD: before: ${JSON.stringify(this._shareWithIds, null, 2)}`);
    const shares1 = this._shareWithIds[id1];
    const shares2 = this._shareWithIds[id2];

    if ((shares1) && (id2 === 'ROOT')) {
      // Delete all relations.
      Object.keys(shares1).forEach(id => delete this._shareWithIds[id]);
      delete this._shareWithIds[id1];
    } else {
      if ((shares1) && (shares1[id2])) {
        if (Object.keys(shares1).length > 1) {
          delete shares1[id2];
        } else {
          delete this._shareWithIds[id1];
        }
      }

      if ((shares2) && (shares2[id1])) {
        if (Object.keys(shares2).length > 1) {
          delete shares2[id1];
        } else {
          delete this._shareWithIds[id2];
        }
      }
    }
    console.log(`AD: after: ${JSON.stringify(this._shareWithIds, null, 2)}\n`);
  }

  addShare(id1, id2, sharingType) {
    console.log(`\nAD: addShare(${id1}, ${id2}, ${sharingType})`);
    console.log(`AD: before: ${JSON.stringify(this._shareWithIds, null, 2)}`);
    let shares1 = this._shareWithIds[id1];
    let shares2 = this._shareWithIds[id2];

    if ((shares1) && (id2 === 'ROOT')) {
      // Delete all relations.
      Object.keys(shares1).forEach((id) => {
        if (id === 'ROOT') {
          if (sharingType === SharingTypes.NONE) {
            this._delete(id1, 'ROOT');
          } else {
            shares1.ROOT = sharingType;
          }
        } else {
          this._delete(id, id1);
        }
      });
    } else {
      if (!shares1) {
        shares1 = {};
        this._shareWithIds[id1] = shares1;
      }
      shares1[id2] = sharingType;

      if (!shares2) {
        shares2 = {};
        this._shareWithIds[id2] = shares2;
      }
      shares2[id1] = sharingType;
    }
    console.log(`AD: after: ${JSON.stringify(this._shareWithIds, null, 2)}\n`);
  }
}

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
          name: 'my.pdf',
          share: SharingTypes.SOME,
          shareWithIds: {
            '0ac5d3d5-689f-4137-af05-20435ce1ba35': '0ac5d3d5-689f-4137-af05-20435ce1ba35'
          }
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
      shareWithIds: new ShareWithIds({
        '0ac5d3d5-689f-4137-af05-20435ce1ba35': {
          'my.pdf': SharingTypes.ALL
        },
        'my.pdf': {
          ROOT: SharingTypes.SOME,
          '0ac5d3d5-689f-4137-af05-20435ce1ba35': SharingTypes.ALL
        }
      })
    };
  }
);

