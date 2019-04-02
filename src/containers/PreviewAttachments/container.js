import { connect } from 'react-redux';

import { getToken, getCurrentOrgId } from 'src/selectors';
import { PreviewAttachments } from 'src/components';

const mapStateToProps = (state, props) => {
  const { conversationId, personalConversation } = props;

  return {
    orgId: getCurrentOrgId(state),
    token: getToken(state),
    conversationId: conversationId || personalConversation.conversationId
  };
};

export default connect(mapStateToProps)(PreviewAttachments);
