import { combineReducers } from 'redux';
import { union, omit, compact, mergeWith, isArray, uniq } from 'lodash';

import {
  MESSAGE_SCHEDULE_CREATE_SUCCESS,
  MESSAGE_SCHEDULE_DELETE_SUCCESS,
  MESSAGE_SCHEDULE_UPDATE_SUCCESS,
  MESSAGES_SCHEDULE_FETCH_SUCCESS
} from 'src/actions';

const byId = (state = {}, action) => {
  switch (action.type) {
    case MESSAGES_SCHEDULE_FETCH_SUCCESS: {
      const { messages = [] } = action.payload;

      if (messages.length === 0) return state;

      return {
        ...state,
        ...messages.reduce(
          (acc, message) => ({
            ...acc,
            [message.id]: message
          }),
          state
        )
      };
    }
    case MESSAGE_SCHEDULE_UPDATE_SUCCESS:
    case MESSAGE_SCHEDULE_CREATE_SUCCESS: {
      const { message } = action.payload;
      return { ...state, [message.id]: message };
    }
    case MESSAGE_SCHEDULE_DELETE_SUCCESS: {
      const { message } = action.payload;
      const scheduleId = message.id;
      return omit(state, scheduleId);
    }
    default:
      return state;
  }
};

const allMessageIds = (state = [], action) => {
  switch (action.type) {
    case MESSAGES_SCHEDULE_FETCH_SUCCESS: {
      const { messages = [] } = action.payload;

      if (messages.length === 0) return state;

      return compact(union(state, messages.map(message => message.id)));
    }
    case MESSAGE_SCHEDULE_UPDATE_SUCCESS:
    case MESSAGE_SCHEDULE_CREATE_SUCCESS: {
      const { message } = action.payload;
      return union(state, [message.id]);
    }
    case MESSAGE_SCHEDULE_DELETE_SUCCESS: {
      const { message } = action.payload;
      const scheduleId = message.id;
      return state.filter(item => item !== scheduleId);
    }
    default:
      return state;
  }
};

const allGlobalMessageIds = (state = {}, action) => {
  switch (action.type) {
    case MESSAGES_SCHEDULE_FETCH_SUCCESS: {
      const { messages = [] } = action.payload;

      if (messages.length === 0) return state;
      const globalMessagesByConversationId = {};
      messages
        .filter(message => message.appData && message.appData.globalScheduleId)
        // eslint-disable-next-line no-return-assign
        .forEach(message => (globalMessagesByConversationId[message.appData.globalScheduleId] = [message.id]));

      // eslint-disable-next-line consistent-return
      return mergeWith(state, globalMessagesByConversationId, (objValue, srcValue) => {
        if (isArray(objValue)) {
          return uniq(objValue.concat(srcValue));
        }
      });
    }
    case MESSAGE_SCHEDULE_UPDATE_SUCCESS:
    case MESSAGE_SCHEDULE_CREATE_SUCCESS: {
      const { message } = action.payload;
      if (!(message.appData && message.appData.globalScheduleId)) return state;
      const scheduledIds = state[message.appData.globalScheduleId] || [];
      scheduledIds.push(message.id);

      return {
        ...state,
        [message.appData.globalScheduleId]: scheduledIds
      };
    }

    case MESSAGE_SCHEDULE_DELETE_SUCCESS: {
      const { message } = action.payload;
      return omit(state, message.appData.globalScheduleId);
    }
    default:
      return state;
  }
};

const schedulesReducer = combineReducers({ byId, allMessageIds, allGlobalMessageIds });

export default schedulesReducer;
