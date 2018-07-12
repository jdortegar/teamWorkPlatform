import _ from 'lodash';
import { createSelector } from 'reselect';
import {
  getCurrentSubscriberOrgId,
  getTeamById,
  getTeamIdsBySubscriberOrgId,
  getTeamRoomById,
  getTeamRoomIdsByTeamId
} from './state';

// // Redux.
// sharingSettings: {
//   google: {
//     nodesById: {},
//     nodeHierarchy: []
//   },
//   box: {
//     nodesById: {},
//     nodeHierarchy: []
//   }
// }

export const getCurrentSubscriberOrgTeamsAndTeamRooms = createSelector(
  [getCurrentSubscriberOrgId, getTeamById, getTeamIdsBySubscriberOrgId, getTeamRoomById, getTeamRoomIdsByTeamId],
  (currentSubscriberOrgId, teamById, teamIdsBySubscriberOrgId, teamRoomById, teamRoomIdsByTeamId) => {
    const ret = {
      nodesById: {},
      nodeHierarchy: []
    };

    if (currentSubscriberOrgId && teamIdsBySubscriberOrgId[currentSubscriberOrgId]) {
      // eslint-disable-next-line no-restricted-syntax
      for (const teamId of teamIdsBySubscriberOrgId[currentSubscriberOrgId]) {
        const teamRoomIds = teamRoomIdsByTeamId[teamId];
        if (!teamRoomIds || teamRoomIds.length === 0) {
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
        teamRoomIds.forEach(teamRoomId => {
          const teamRoom = _.cloneDeep(teamRoomById[teamRoomId]);
          teamRoom.id = teamRoom.teamRoomId;
          teamRoom.type = 'TEAMROOM';
          team.childNodeIds[teamRoomId] = teamRoomId;
          ret.nodesById[teamRoomId] = teamRoom;
          hierarchyTeam.children.push({ id: teamRoomId });
        });
      }
    }

    return ret.nodeHierarchy.length > 0 ? ret : undefined;
  }
);

export const SharingTypes = Object.freeze({
  ALL: 'ALL',
  SOME: 'SOME',
  NONE: 'NONE'
});

class ShareWithIds {
  shareWithIdsObj;

  constructor(shareWithIds) {
    this.shareWithIdsObj = shareWithIds;
  }

  length() {
    return Object.keys(this.shareWithIdsObj).length;
  }

  getShares(id) {
    return this.shareWithIdsObj[id];
  }

  delete(id1, id2) {
    const share1 = this.shareWithIdsObj[id1];
    if (share1) {
      const share2 = share1[id2];
      if (share2) {
        delete share1[id2];
      }
      if (Object.keys(share1).length === 0) {
        delete this.shareWithIdsObj[id1];
      }
    }
  }

  getSharingType(id1, id2) {
    let shareType = SharingTypes.NONE;
    const share1 = this.shareWithIdsObj[id1];
    if (share1) {
      if (share1[id2]) {
        shareType = share1[id2];
        // } else if (Object.keys(share1).length > 0) {
        //   shareType = SharingTypes.SOME;
      }
    }
    return shareType;
  }

  deleteShare(id1, id2) {
    const shares1 = this.shareWithIdsObj[id1];
    const shares2 = this.shareWithIdsObj[id2];

    if (shares1 && id2 === 'ROOT') {
      // Delete all relations.
      Object.keys(shares1).forEach(id => delete this.shareWithIdsObj[id]);
      delete this.shareWithIdsObj[id1];
    } else {
      if (shares1 && shares1[id2]) {
        if (Object.keys(shares1).length > 1) {
          delete shares1[id2];
        } else {
          delete this.shareWithIdsObj[id1];
        }
      }

      if (shares2 && shares2[id1]) {
        if (Object.keys(shares2).length > 1) {
          delete shares2[id1];
        } else {
          delete this.shareWithIdsObj[id2];
        }
      }
    }
  }

  addShare(id1, id2, sharingType) {
    let shares1 = this.shareWithIdsObj[id1];
    let shares2 = this.shareWithIdsObj[id2];

    if (id1 === 'ROOT' && id2 === 'ROOT') {
      // Delete everything because this is the absolute root.
      Object.keys(this.shareWithIdsObj).forEach(id => delete this.shareWithIdsObj[id]);
    } else if (shares1 && id2 === 'ROOT') {
      // Delete all relations.
      Object.keys(shares1).forEach(id => {
        if (id === 'ROOT') {
          if (sharingType === SharingTypes.NONE) {
            this.delete(id1, 'ROOT');
          } else {
            shares1.ROOT = sharingType;
          }
        } else {
          this.delete(id, id1);
        }
      });
    } else {
      if (!shares1) {
        shares1 = {};
        this.shareWithIdsObj[id1] = shares1;
      }
      shares1[id2] = sharingType;

      if (!shares2) {
        shares2 = {};
        this.shareWithIdsObj[id2] = shares2;
      }
      shares2[id1] = sharingType;
    }
  }
}

// eslint-disable-next-line no-unused-vars
export const getIntegrationFilesAndFolders = createSelector([getCurrentSubscriberOrgId], currentSubscriberOrgId => ({
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
      // ALL or NONE
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
  shareWithIds: new ShareWithIds({})
}));
