import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { setActiveConversation, requestConversations, requestTranscript } from '../../actions';
import config from '../../config/env';
import { getJwt } from '../../session';

const propTypes = {
  match: PropTypes.object,
  setActiveConversation: PropTypes.func.isRequired,
  requestTranscript: PropTypes.func.isRequired,
  activeConversationId: PropTypes.string.isRequired,
  conversationById: PropTypes.object.isRequired
};

const defaultProps = {
  match: {}
};

class Chat extends Component {
  componentDidMount() {
    const { conversationId } = this.props.match.params;
    const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

    this.props.requestTranscript(conversationId);
    this.props.setActiveConversation(conversationId);

    axios.post(
      `${config.hablaApiBaseUri}/conversations/${conversationId}/createMessage`,
      { messageType: 'text', text: 'not much' },
      axiosOptions)
      .then(() => {
      });
  }

  renderMessages() {
    // const { activeConversationId, conversationById } = this.props;
    // return conversationById[activeConversationId]
  }

  render() {
    // const { activeConversationId, conversationById } = this.props;
    //
    // if ((activeConversationId === null) || (!conversationById) || (!conversationById[activeConversationId])) {
    //   return null;
    // }

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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    requestConversations,
    requestTranscript,
    setActiveConversation
  }, dispatch);
}

Chat.propTypes = propTypes;
Chat.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
