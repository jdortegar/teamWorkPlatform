export function inviteUser(users, susbcriberOrg) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return (dispatch) => {
    return axios.post(`${config.hablaApiBaseUri}/subscriberOrgs/inviteSubscribers/${susbcriberOrg}`, { userIdOrEmails: users }, axiosOptions)
      .then((response) => {
        console.log(response);
      })
      .catch();
  };
}
