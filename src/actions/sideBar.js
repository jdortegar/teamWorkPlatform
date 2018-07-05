export const TOGGLE_SIDEBAR = 'toogle_sidebar';
export const SHOW_SIDEBAR = 'show_sidebar';

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
