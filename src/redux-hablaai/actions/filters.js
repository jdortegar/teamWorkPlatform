export const TOGGLE_OWNER_FILTER = 'filters/toggleOwner';
export const TOGGLE_INTEGRATION_FILTER = 'filters/toggleIntegration';
export const TOGGLE_FILETYPE_FILTER = 'filters/toggleFileType';
export const SET_START_DATE_FILTER = 'filters/setStartDate';
export const SET_END_DATE_FILTER = 'filters/setEndDate';

export const toggleOwnerFilter = key => ({
  type: TOGGLE_OWNER_FILTER,
  payload: { key }
});

export const toggleIntegrationFilter = key => ({
  type: TOGGLE_INTEGRATION_FILTER,
  payload: { key }
});

export const toggleFileTypeFilter = key => ({
  type: TOGGLE_FILETYPE_FILTER,
  payload: { key }
});

export const setStartDateFilter = startDate => ({
  type: SET_START_DATE_FILTER,
  payload: { startDate }
});

export const setEndDateFilter = endDate => ({
  type: SET_END_DATE_FILTER,
  payload: { endDate }
});
