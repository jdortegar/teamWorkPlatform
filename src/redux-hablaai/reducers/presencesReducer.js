import _ from 'lodash';
import {
  PRESENCE_CHANGE
} from '../actions';

const INITIAL_STATE = {
  presencesByUserId: {}
};

const presencesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PRESENCE_CHANGE: {
      const presencesByUserId = _.cloneDeep(state.presencesByUserId);
      const { presence } = action.payload;
      let presences = presencesByUserId[presence.userId];
      const uniqueness = `${presence.address}##${presence.userAgent}`; // Uniqueness by address + userAgent combination.

      if (!presences) {
        presences = {};
        presencesByUserId[presence.userId] = presences;
      }

      presences[uniqueness] = presence;
      return {
        ...state,
        presencesByUserId
      };
    }
    default:
      return state;
  }
};

export default presencesReducer;
