import { combineReducers } from 'redux';
import { union } from 'lodash';

import { BOOKMARKS_FETCH_SUCCESS, BOOKMARK_CREATE_SUCCESS } from 'src/actions';

const byId = (state = {}, action) => {
  switch (action.type) {
    case BOOKMARKS_FETCH_SUCCESS: {
      const { bookmarks = [] } = action.payload;
      return {
        ...state,
        ...bookmarks.reduce(
          (acc, { id, userId, message = {} }) => ({
            ...acc,
            [id]: {
              id,
              userId,
              messageId: message.id
            }
          }),
          state
        )
      };
    }
    case BOOKMARK_CREATE_SUCCESS: {
      const { bookmark } = action.payload;
      return { ...state, [bookmark.id]: bookmark };
    }
    default:
      return state;
  }
};

const allMessageIds = (state = [], action) => {
  switch (action.type) {
    case BOOKMARKS_FETCH_SUCCESS: {
      const { bookmarks = [] } = action.payload;
      return union(state, bookmarks.map(({ message }) => message.id));
    }
    case BOOKMARK_CREATE_SUCCESS: {
      const { bookmark } = action.payload;
      return union(state, [bookmark.messageId]);
    }
    default:
      return state;
  }
};

const bookmarksReducer = combineReducers({ byId, allMessageIds });

export default bookmarksReducer;
