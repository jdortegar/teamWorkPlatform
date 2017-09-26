import React, { Component } from 'react';
import { Card, Icon } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  file: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired
};

class PreviewCard extends Component {
  constructor(props) {
    super(props);

    this.state = { src: '' };
  }

  componentDidMount() {
    const reader = new FileReader();
    reader.onload = ((e) => {
      this.setState({ src: e.target.result });
    });
    reader.readAsDataURL(this.props.file);
  }

  render() {
    return (
      <Card
        className="PreviewCard__container"
        extra={
          <a className="PreviewCard__close-button" onClick={this.props.handleRemove}>
            <Icon type="close-circle" />
          </a>
        }
        bordered={false}
      >
        <img className="PreviewCard__image" alt="example" width="100%" src={this.state.src} />
      </Card>
    );
  }
}

PreviewCard.propTypes = propTypes;

export default PreviewCard;
