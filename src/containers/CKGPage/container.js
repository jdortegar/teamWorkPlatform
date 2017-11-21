import { connect } from 'react-redux';
import CKGPage from '../../pages/CKGPage';
import { fetchTimeActivityBySubscriberOrgId } from '../../actions';

const mapStateToProps = state => ({
  currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId
});

const mapDispatchToProps = dispatch => ({
  fetchTimeActivityBySubscriberOrgId: subscriberOrgId => dispatch(fetchTimeActivityBySubscriberOrgId(subscriberOrgId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CKGPage);
