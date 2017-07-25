import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setActiveConversation, requestTranscript } from '../../actions';

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

const mapDispatchToProps = dispatch => bindActionCreators({
  setActiveConversation,
  requestTranscript
}, dispatch);

export default connect(null, mapDispatchToProps)(Chat);
