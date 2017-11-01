import messaging from '../messaging';

export const myLocation = (lat, lon, alt = undefined, accuracy = undefined) => { // eslint-disable-line import/prefer-default-export
  return (dispatch) => { // eslint-disable-line no-unused-vars
    messaging().location(lat, lon, alt, accuracy);
  };
};
