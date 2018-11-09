import { connect } from 'react-redux';
import { getCurrentSubscriberOrg } from 'src/selectors';
import { HomePage } from 'src/pages';

const mapStateToProps = state => ({
  org: getCurrentSubscriberOrg(state)
});

export default connect(mapStateToProps)(HomePage);
