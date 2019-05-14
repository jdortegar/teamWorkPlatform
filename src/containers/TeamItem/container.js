import { connect } from 'react-redux';

import { getUnreadMessages, getTeamConversation } from 'src/selectors';
import { TeamItem } from 'src/components';

const mapStateToProps = (state, props) => {
  const { teamId } = props.team;
  const conversation = getTeamConversation(state, teamId) || {};

  return {
    unreadMessages: getUnreadMessages(state, conversation.id)
  };
};

export default connect(mapStateToProps)(TeamItem);
