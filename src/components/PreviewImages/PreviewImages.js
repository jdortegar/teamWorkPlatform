import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { getJwt } from '../../session';
import './styles/style.css';

const propTypes = {
  images: PropTypes.array
};

const defaultProps = {
  images: []
};

class PreviewImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      images: []
    };

    this.handlePreview = this.handlePreview.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const { images } = this.props;
    const putHeaders = {
      headers: {
        Authorization: `Bearer ${getJwt()}`
      }
    };
    const imagesBase64 = [];
    images.forEach((image) => {
      const { resourceId } = image;
      axios.get(`https://uw33cc3bz4.execute-api.us-west-2.amazonaws.com/dev/resource/${resourceId}`, putHeaders)
        .then((resource) => {
          const imageBase64 = resource.data.split('base64')[1];
          const imageSrc = `data:${resource.headers['content-type']};base64,${imageBase64}`;
          imagesBase64.push(imageSrc);
          this.setState({
            images: imagesBase64
          });
        });
    });
  }

  handleCancel() {
    this.setState({
      previewVisible: false
    });
  }

  handlePreview(image) {
    this.setState({
      previewVisible: true,
      previewImage: image
    });
  }

  render() {
    const { images, previewVisible, previewImage } = this.state;
    return (
      <div className="preview-images">
        { images.map((image, index) => (
          <div className="image-wrapper" key={index}>
            <img src={image} alt="" onClick={() => this.handlePreview(image)} />
          </div>
        )
        )}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img className="PreviewImages__modal-img" alt="" src={previewImage} />
        </Modal>
      </div>
    );
  }
}

PreviewImages.propTypes = propTypes;
PreviewImages.defaultProps = defaultProps;

export default PreviewImages;

