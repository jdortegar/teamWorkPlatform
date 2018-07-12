import messaging from '../messaging';

// eslint-disable-next-line import/prefer-default-export
export const myLocation = (lat, lon, alt = undefined, accuracy = undefined) => () => {
  messaging().location(lat, lon, alt, accuracy);
};
