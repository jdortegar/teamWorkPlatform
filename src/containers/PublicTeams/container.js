import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { PublicTeams } from 'src/components';
import { fetchPublicTeams } from 'src/actions';
import { getCurrentSubscriberOrgId, getOrgPublicTeams } from 'src/selectors';

const mapStateToProps = state => {
  return {
    orgId: getCurrentSubscriberOrgId(state),
    publicTeams: getOrgPublicTeams(state)
  };
};

const mapDispatchToProps = {
  fetchPublicTeams
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PublicTeams)
);
