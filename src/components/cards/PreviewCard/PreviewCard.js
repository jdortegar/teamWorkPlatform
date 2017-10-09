import React, { Component } from 'react';
import { Card, Icon } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  file: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired
};

function readFileAsBinary(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
}

class PreviewCard extends Component {
  constructor(props) {
    super(props);

    this.state = { src: '' };
  }

  componentDidMount() {
    readFileAsBinary(this.props.file)
      .then((binary) => {
        this.props.addBase(this.props.file, binary);
      });
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
        <img className="PreviewCard__image" alt="example" width="100%" src={this.props.file.src} />
      </Card>
    );
  }
}

PreviewCard.propTypes = propTypes;

export default PreviewCard;
