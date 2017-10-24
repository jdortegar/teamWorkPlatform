import React, { Component } from 'react';
import { Card, Icon } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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

  renderFile(isImage, fileName) {
    const [name, extension] = fileName.split('.');
    if (isImage) {
      return <img className="PreviewCard__image" alt="example" width="100%" src={this.props.file.src} />;
    }
    return <div>
      <div className="file-wrapper">
        <i className="fa fa-file file-icon" aria-hidden="true">
        </i>
        <span className="file-type">{extension}</span>
      </div>
      <span className="file-name">{name}</span>
    </div>;
  }

  render() {
    const { file } = this.props;
    const fileType = file.type.split('/')[0];
    const isImage = fileType === 'image';
    const previewCard = classNames({
      'PreviewCard__container': true,
      'PreviewCard__is-file': !isImage
    });
    return (
      <Card
        className={previewCard}
        extra={
          <a className="PreviewCard__close-button" onClick={this.props.handleRemove}>
            <Icon type="close-circle" />
          </a>
        }
        bordered={false}
      >
        {this.renderFile(isImage, file.name)}
      </Card>
    );
  }
}

PreviewCard.propTypes = propTypes;

export default PreviewCard;
