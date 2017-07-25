import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setActiveConversation, requestConversations, requestTranscript } from '../../actions';

class Chat extends Component {
  constructor(props) {
    super(props);

    const { conversationId } = this.props.match.params;
    this.props.requestTranscript(conversationId);
    this.props.setActiveConversation(conversationId);
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { activeConversationId, conversationById } = this.props;
    if ((activeConversationId === null) || (!conversationById) || (!conversationById[activeConversationId])) {
      return null;
    }

    return (
      <div>Chat page</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    conversationById: state.conversations.conversationById,
    activeConversationId: state.conversations.activeConversationId
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  requestConversations,
  requestTranscript,
  setActiveConversation
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
