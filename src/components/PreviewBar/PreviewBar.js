import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';
import PreviewCard from '../cards/PreviewCard';
import messages from './messages';
import './styles/style.css';

const propTypes = {
  files: PropTypes.array,
  replyTo: PropTypes.shape({
    text: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    preferences: PropTypes.shape({
      iconColor: PropTypes.string
    }).isRequired
  })
};

const defaultProps = {
  files: [],
  replyTo: {
    text: '',
    firstName: '',
    lastName: '',
    preferences: {
      iconColor: 'rgb(130, 150, 190)'
    }
  }
};

class PreviewBar extends Component {
  constructor(props) {
    super(props);

    this.state = { files: props.files, replyTo: props.replyTo };
  }

  handleRemoveCard(file) {
    const files = this.state.files.filter((el) => {
      return el !== file;
    });

    this.setState({ files });
  }

  renderPreviewCards() {
    return this.state.files.map((el) => {
      return <PreviewCard file={el} key={el.name} handleRemove={() => this.handleRemoveCard(el)} />;
    });
  }

  render() {
    return (
      <Row type="flex" justify="start" align="middle" gutter={20} className="PreviewBar__message_reply-container">
        <Col xs={{ span: 21 }} style={{ borderLeft: `6px solid ${this.state.replyTo.preferences.iconColor}` }}>
          <p className="PreviewBar__message-body-name">{this.state.replyTo.firstName} {this.state.replyTo.lastName}</p>
          <p className="PreviewBar__message-body-text">
            {this.state.replyTo.text}
          </p>
          <div className="PreviewBar__files-container" style={{ display: 'flex' }}>
            {this.renderPreviewCards()}
          </div>
        </Col>
        <Col xs={{ span: 3 }} className="PreviewBar__message-cancel-reply-col">
          <a className="PreviewBar__message-cancel-reply" onClick={this.onCancelReply} title={messages.cancel}>
            <Icon type="close-circle-o" />
          </a>
        </Col>
      </Row>
    );
  }
}

PreviewBar.propTypes = propTypes;
PreviewBar.defaultProps = defaultProps;

export default PreviewBar;
