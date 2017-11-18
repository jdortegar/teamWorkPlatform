import { TOGGLE_SIDEBAR, SHOW_SIDEBAR } from './types';

export const toggleSideBar = () => {
  return {
    type: TOGGLE_SIDEBAR
  };
};

export const showSideBar = () => {
  return {
    type: SHOW_SIDEBAR
  };
};
