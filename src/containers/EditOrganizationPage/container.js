import { connect } from 'react-redux';
import { updateSubscriberOrg } from 'src/actions';
import { EditOrganizationPage } from 'src/pages';

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
