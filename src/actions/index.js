import axios from 'axios';

export const RECEIVE_HOME_DATA = 'RECEIVE_HOME_DATA';
export const RECEIVE_SUBPAGE_DATA = 'RECEIVE_SUBPAGE_DATA';

// TODO: AD: Move apiUrl/apiEndpoints elsewhere, once I get the connection to server working.
const apiUrl = 'http://api.fixer.io';
const apiEndpoints = {
   testAPIHomepage: `${apiUrl}/latest?base=USD`,
   testAPISubpage: `${apiUrl}/latest?base=GBP`
};


export function receiveHomeData(data) {
   return {
      type: RECEIVE_HOME_DATA,
      data
   };
}

export function requestHomeData() {
   return dispatch => axios.get(apiEndpoints.testAPIHomepage)
      .then(response => response.data)
      .then(json => dispatch(receiveHomeData(json)));
}


export function receiveSubpageData(data) {
   return {
      type: RECEIVE_SUBPAGE_DATA,
      data
   };
}

export function requestSubpageData() {
   return dispatch => axios.get(apiEndpoints.testAPISubpage)
      .then(response => response.data)
      .then(json => dispatch(receiveSubpageData(json)));
}
