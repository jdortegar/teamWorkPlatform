import { combineReducers } from 'redux';
import { union, omit, compact } from 'lodash';

import { BOOKMARKS_FETCH_SUCCESS, BOOKMARK_CREATE_SUCCESS, BOOKMARK_DELETE_SUCCESS } from 'src/actions';

const byId = (state = {}, action) => {
  switch (action.type) {
    case BOOKMARKS_FETCH_SUCCESS: {
      const { bookmarks = [] } = action.payload;
      return {
        ...state,
        ...bookmarks.reduce((acc, { id, userId, message }) => {
          if (!message) return acc;
          return {
            ...acc,
            [id]: {
              id,
              userId,
              messageId: message.id
            }
          };
        }, state)
      };
    }
    case BOOKMARK_CREATE_SUCCESS: {
      const { bookmark } = action.payload;
      return { ...state, [bookmark.id]: bookmark };
    }
    case BOOKMARK_DELETE_SUCCESS: {
      const { bookmark } = action.payload;
      return omit(state, bookmark.id);
    }
    default:
      return state;
  }
};

const allMessageIds = (state = [], action) => {
  switch (action.type) {
    case BOOKMARKS_FETCH_SUCCESS: {
      const { bookmarks = [] } = action.payload;
      return compact(union(state, bookmarks.map(({ message }) => (message ? message.id : null))));
    }
    case BOOKMARK_CREATE_SUCCESS: {
      const { bookmark } = action.payload;
      return union(state, [bookmark.messageId]);
    }
    case BOOKMARK_DELETE_SUCCESS: {
      const { bookmark } = action.payload;
      return state.filter(item => item !== bookmark.messageId);
    }
    default:
      return state;
  }
};

const bookmarksReducer = combineReducers({ byId, allMessageIds });

export default bookmarksReducer;
