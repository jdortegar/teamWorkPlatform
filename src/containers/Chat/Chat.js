import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { setActiveConversation, requestTranscript } from '../../actions';

const propTypes = {
  match: PropTypes.object,
  setActiveConversation: PropTypes.string.isRequired,
  requestTranscript: PropTypes.string.isRequired
};

const defaultProps = {
  match: {}
};

class Chat extends Component {
  constructor(props) {
    super(props);

    const { conversationId } = this.props.match.params;
    this.props.setActiveConversation(conversationId);
    this.props.requestTranscript(conversationId);
  }

  render() {
    return (
      <div>Chat page</div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setActiveConversation, requestTranscript }, dispatch);
}

Chat.propTypes = propTypes;
Chat.defaultProps = defaultProps;

export default connect(null, mapDispatchToProps)(Chat);
