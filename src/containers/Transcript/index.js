import React, { Component } from 'react';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestTranscript } from '../../actions';
import Spinner from '../../components/Spinner';
import Messages from './Messages';
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

  componentDidMount() {
    const { conversationId } = this.props.match.params;
    const { conversations } = this.props;
    if ((!conversations[conversationId]) || (!conversations[conversationId].transcript)) {
      this.props.requestTranscript(conversationId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { conversationId } = this.props.match.params;
    const { conversations } = nextProps;

    console.log(conversations);
    if ((conversations[conversationId]) && (conversations[conversationId].transcript)) {
      let { messages } = this.state;
      if ((!messages) || (messages.conversationId !== conversationId)) {
        messages = new Messages(conversationId, conversations[conversationId].transcript);
        this.setState({ messages });
      } else {
        messages.addMessages(conversations[conversationId].transcript);
      }
    } else {
      this.props.requestTranscript(conversationId);
    }
  }

  render() {
    const { conversationId } = this.props.match.params;
    const messages = this.state.messages;
    if ((!messages) || (messages.conversationId !== conversationId)) {
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
