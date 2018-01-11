import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamMemberPage from '../../pages/TeamMemberPage';
import { getCurrentSubscriberOrg } from '../../selectors';

function mapStateToProps(state) {
  return {
    subscriberOrg: getCurrentSubscriberOrg(state)
  };
}

function mapDispatchToProps() {
  return {

  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamMemberPage));
