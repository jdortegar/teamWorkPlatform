import { connect } from 'react-redux';
import EditOrganizationPage from '../../pages/EditOrganizationPage';
import { updateSubscriberOrg } from '../../actions';

const mapStateToProps = state => ({
  subscriberOrgs: state.subscriberOrgs
});

const mapDispatchToProps = dispatch => ({
  updateSubscriberOrg: (name, subscriberOrgId) => dispatch(updateSubscriberOrg(name, subscriberOrgId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditOrganizationPage);
