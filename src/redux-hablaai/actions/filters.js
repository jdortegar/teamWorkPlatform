export const TOGGLE_OWNER_FILTER = 'filters/toggleOwner';
export const TOGGLE_INTEGRATION_FILTER = 'filters/toggleIntegration';
export const TOGGLE_FILETYPE_FILTER = 'filters/toggleFileType';

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
