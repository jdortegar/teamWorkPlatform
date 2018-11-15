export const UI_CKG_CHANGE_VIEW = 'ui/ckg/changeView';
export const CKG_VIEWS = {
  TIME_ACTIVITY: 'timeActivityView',
  FILE_LIST: 'fileListView'
};

export const changeCKGView = activeView => ({
  type: UI_CKG_CHANGE_VIEW,
  payload: { activeView }
});
