export const getAuth = state => state.auth;

export const isAuthenticated = state => state.auth.authenticated;
export const isLoggingIn = state => state.auth.loggingIn;

export const getResourcesUrl = state => state.auth.resourcesUrl;
export const getToken = state => state.auth.token;
export const getAuthError = state => state.auth.error;
export const getCurrentUserId = state => state.auth.userId;
