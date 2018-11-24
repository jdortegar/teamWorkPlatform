import { connect } from 'react-redux';

import { getCurrentSubscriberOrgId } from 'src/selectors';
import { IntegrationsList } from 'src/components';

const mapStateToProps = state => ({
  orgId: getCurrentSubscriberOrgId(state)
});

export default connect(mapStateToProps)(IntegrationsList);
