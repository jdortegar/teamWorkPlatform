import { connect } from 'react-redux';
import EditOrganizationPage from '../../pages/EditOrganizationPage';
import { updateSubscriberOrg } from '../../actions';
import { getUrlRequestStatus, getTeamMembersOfTeamId } from '../../selectors';

function mapStateToProps(state, props) {
  const { teamId } = props.match.params;
  return {
    subscriberOrgs: state.subscriberOrgs,
    user: state.auth.user,
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    updateSubscriberOrgRequestStatus: getUrlRequestStatus(state, updateSubscriberOrg(null, teamId, true))
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSubscriberOrg: (name, subscriberOrgId) => dispatch(updateSubscriberOrg(name, subscriberOrgId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganizationPage);
