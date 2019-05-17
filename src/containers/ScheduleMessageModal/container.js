import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ScheduleMessageModal } from 'src/components';

import { createScheduleMessage, updateScheduleMessage, deleteScheduleMessage } from 'src/actions';
import { getCurrentUser, getCurrentSubscriberOrgId, getConversationIdsByMember, getSchedulesById } from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { message } = props;
  const globalScheduleId = message && message.appData ? message.appData.globalScheduleId : null;
  let scheduleGlobalMessagesById;
  if (globalScheduleId) {
    const scheduleGlobalMessages = getSchedulesById(state);
    scheduleGlobalMessagesById = Object.values(scheduleGlobalMessages).filter(
      msg => msg.appData.globalScheduleId === globalScheduleId
    );
  }
  const orgId = getCurrentSubscriberOrgId(state);

  return {
    orgId,
    currentUser: getCurrentUser(state),
    conversationIdsByMember: Object.values(getConversationIdsByMember(state)),
    scheduleGlobalMessagesById
  };
};

const mapDispatchToProps = {
  createScheduleMessage,
  updateScheduleMessage,
  deleteScheduleMessage
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ScheduleMessageModal)
);
