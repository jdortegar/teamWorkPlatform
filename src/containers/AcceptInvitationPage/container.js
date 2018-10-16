import { connect } from 'react-redux';
import { setCurrentSubscriberOrgId } from 'src/actions';
import { getInvitations, getTeamsById } from 'src/selectors';
import { AcceptInvitationPage } from 'src/pages';

function mapStateToProps(state) {
  return {
    invitations: getInvitations(state),
    teamById: getTeamsById(state),
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentSubscriberOrgId: subscriberOrgId => dispatch(setCurrentSubscriberOrgId(subscriberOrgId))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AcceptInvitationPage);
