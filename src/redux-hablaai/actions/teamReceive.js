export const TEAM_RECEIVE = 'team/receive';
export const TEAM_PUBLIC_RECEIVE = 'team/public/receive';

export const receiveTeam = team => ({
  type: TEAM_RECEIVE,
  payload: { team }
});

export const receivePublicTeam = team => ({
  type: TEAM_PUBLIC_RECEIVE,
  payload: { team }
});
