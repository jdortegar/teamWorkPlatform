import _ from 'lodash';

export const sortByName = (a, b) => {
  if (a.name < b.name) return -1;
  else if (a.name > b.name) return 1;
  return 0;
};

export const sortByLastCreatedFirst = (a, b) => {
  if (a.created === b.created) return 0;
  return (a.created < b.created) ? 1 : -1;
};

export const primaryAtTop = (teams) => {
  const primaryTeam = _.find(teams, { primary: true });
  const index = teams.indexOf(primaryTeam);
  if (index > -1) {
    teams.splice(index, 1);
  }
  teams.unshift(primaryTeam);
  return teams;
};
