import { combineReducers } from 'redux';
import { union, omit, compact, mergeWith, isArray, uniq } from 'lodash';

import {
  MESSAGE_SCHEDULE_CREATE_SUCCESS,
  MESSAGE_SCHEDULE_DELETE_SUCCESS,
  MESSAGE_SCHEDULE_UPDATE_SUCCESS,
  MESSAGES_SCHEDULE_FETCH_SUCCESS,
  MESSAGE_SCHEDULE_RECEIVED
} from 'src/actions';

const byId = (state = {}, action) => {
  switch (action.type) {
    case MESSAGES_SCHEDULE_FETCH_SUCCESS: {
      const { messages = [] } = action.payload;

      return {
        ...state,
        ...messages.reduce(
          (acc, message) => ({
            ...acc,
            [message.appData.sortId]: message
          }),
          state
        )
      };
    }
    case MESSAGE_SCHEDULE_UPDATE_SUCCESS:
    case MESSAGE_SCHEDULE_CREATE_SUCCESS: {
      const { message } = action.payload;
      return { ...state, [message.appData.sortId]: message };
    }
    case MESSAGE_SCHEDULE_RECEIVED:
    case MESSAGE_SCHEDULE_DELETE_SUCCESS: {
      const { message } = action.payload;
      const scheduleId = message.appData.sortId;
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

      return compact(union(state, messages.map(message => message.appData.sortId)));
    }
    case MESSAGE_SCHEDULE_UPDATE_SUCCESS:
    case MESSAGE_SCHEDULE_CREATE_SUCCESS: {
      const { message } = action.payload;
      return union(state, [message.appData.sortId]);
    }
    case MESSAGE_SCHEDULE_RECEIVED:
    case MESSAGE_SCHEDULE_DELETE_SUCCESS: {
      const { message } = action.payload;
      const scheduleId = message.appData.sortId;
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
        .forEach(
          // eslint-disable-next-line no-return-assign
          message => (globalMessagesByConversationId[message.appData.globalScheduleId] = [message.appData.sortId])
        );

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
      scheduledIds.push(message.appData.sortId);

      return {
        ...state,
        [message.appData.globalScheduleId]: scheduledIds
      };
    }
    case MESSAGE_SCHEDULE_RECEIVED:
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
