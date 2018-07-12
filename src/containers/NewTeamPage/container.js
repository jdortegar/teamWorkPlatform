import { connect } from 'react-redux';
import NewTeamPage from '../../pages/NewTeamPage';
import { createTeam } from '../../actions';

function mapStateToProps(state) {
  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createTeam: (name, subscriberOrgId) => dispatch(createTeam(name, subscriberOrgId))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTeamPage);
