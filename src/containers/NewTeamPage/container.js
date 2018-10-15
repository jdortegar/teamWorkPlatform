import { connect } from 'react-redux';
import { createTeam } from 'src/actions';
import { NewTeamPage } from 'src/pages';

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
