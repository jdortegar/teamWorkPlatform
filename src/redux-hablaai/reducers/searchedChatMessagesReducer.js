import uuid from 'uuid/v4';
import { getOwnersFromMessages } from 'src/lib/files';

import {
  GLOBAL_SEARCH_SUCCESS,
  TOGGLE_OWNER_FILTER,
  SET_START_DATE_FILTER,
  SET_END_DATE_FILTER,
  SUBSCRIBERORG_SETCURRENT
} from 'src/actions';

const INITIAL_STATE = {
  teamLoading: {},
  items: [],
  owners: [],
  excludeFilters: {
    owners: {},
    startDate: null,
    endDate: null
  }
};

const updateFiles = (files = []) => ({
  items: files.map(file => ({ ...file, fileKey: uuid() })),
  owners: getOwnersFromMessages(files)
});

const searchedChatMessages = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GLOBAL_SEARCH_SUCCESS: {
      const chatMessages = action.payload.items.data
        .filter(item => item.dataType === '1')
        .map(item => ({
          appData: {},
          content: [
            {
              text: item.content,
              type: item.fileType
            }
          ],
          created: item.dataCreatedAt,
          createdBy: item.hablaUserId,
          id: item.messageId,
          conversationId: item.cid
        }));

      return {
        ...state,
        ...updateFiles(chatMessages)
      };
    }
    case TOGGLE_OWNER_FILTER: {
      const { key } = action.payload;
      return {
        ...state,
        excludeFilters: {
          ...state.excludeFilters,
          owners: {
            ...state.excludeFilters.owners,
            [key]: state.excludeFilters.owners[key] ? null : true
          }
        }
      };
    }
    case SET_START_DATE_FILTER: {
      const { startDate } = action.payload;
      return {
        ...state,
        excludeFilters: {
          ...state.excludeFilters,
          startDate
        }
      };
    }
    case SET_END_DATE_FILTER: {
      const { endDate } = action.payload;
      return {
        ...state,
        excludeFilters: {
          ...state.excludeFilters,
          endDate
        }
      };
    }
    case SUBSCRIBERORG_SETCURRENT:
      return {
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};

export default searchedChatMessages;
