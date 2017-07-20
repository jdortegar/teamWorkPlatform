import React, { Component } from 'react';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestTranscript } from '../../actions';
import Spinner from '../../components/Spinner';
import styles from './styles.scss'; // eslint-disable-line no-unused-vars

class Transcript extends Component {
  static propTypes = {
    match: object.isRequired,
    requestTranscript: func.isRequired,
    conversations: object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { conversationId } = this.props.match.params;
    this.setState({ conversationId });

    const { conversations } = this.props;
    if ((!conversations[conversationId]) || (!conversations[conversationId].transcript)) {
      this.props.requestTranscript(conversationId);
    }
  }

  render() {
    const { conversationId } = this.state;
    const { conversations } = this.props;
    const conversation = conversations[conversationId];
    const transcript = (conversation) ? conversation.transcript : undefined;

    if (!transcript) {
      return <Spinner />;
    }

    return (
      <div>
        Transcript here.
      </div>
    );
  }
}

const mapStateToProps = state => ({
  conversationId: state.conversations.activeConversationId,
  conversations: state.conversations.data.conversations
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestTranscript
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
