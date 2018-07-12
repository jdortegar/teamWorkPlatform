import React, { Component } from 'react';
import { Card, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles/style.css';
import String from '../../../translations';

const propTypes = {
  file: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired
};

function readFileAsBinary(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      resolve(event.target.result);
    };
    reader.onerror = err => {
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
    readFileAsBinary(this.props.file).then(binary => {
      this.props.addBase(this.props.file, binary);
    });
  }

  renderFile(isImage, fileName) {
    const [name, extension] = fileName.split('.');
    if (isImage) {
      return (
        <Tooltip placement="top" title={decodeURI(name)} arrowPointAtCenter>
          <img
            className="PreviewCard__image"
            alt={String.t('PreviewCard.imageAlt')}
            width="100%"
            src={this.props.file.src}
          />
        </Tooltip>
      );
    }
    return (
      <Tooltip placement="top" title={decodeURI(name)} arrowPointAtCenter>
        <div className="file-wrapper__extension">
          <i className="fa fa-file file-icon" aria-hidden="true" />
          <span className="file-wrapper__file-type">{extension}</span>
        </div>
      </Tooltip>
    );
  }

  render() {
    const { file } = this.props;
    const fileType = file.type.split('/')[0];
    const isImage = fileType === 'image';
    const previewCard = classNames({
      PreviewCard__container: true,
      'PreviewCard__is-file': !isImage
    });
    return (
      <Card
        className={previewCard}
        extra={
          <a className="PreviewCard__close-button" onClick={this.props.handleRemove}>
            <i className="fas fa-times-circle" />
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
