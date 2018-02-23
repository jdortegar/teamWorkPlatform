import { connect } from 'react-redux';
import AcceptInvitationPage from '../../pages/AcceptInvitationPage';
import { setCurrentSubscriberOrgId } from '../../actions';
import { getInvitations } from '../../selectors';

function mapStateToProps(state) {
  return {
    invitations: getInvitations(state),
    teamById: state.teams.teamById,
    teamRoomById: state.teamRooms.teamRoomById,
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentSubscriberOrgId: subscriberOrgId => dispatch(setCurrentSubscriberOrgId(subscriberOrgId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AcceptInvitationPage);
