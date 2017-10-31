import messaging from '../messaging';

export const myLocation = (lat, lon, alt = undefined, accuracy = undefined) => {
  messaging().location(lat, lon, alt, accuracy);
};
