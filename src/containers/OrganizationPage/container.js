import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import OrganizationPage from '../../pages/OrganizationPage';
import { requestIntegrations } from '../../actions';

function mapStateToProps(state) {
  return {
    teams: state.teams
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestIntegrations: () => dispatch(requestIntegrations())
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrganizationPage));
