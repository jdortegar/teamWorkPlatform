import React, { Component } from 'react';
import axios from 'axios';
import { getJwt } from '../../session';
import PropTypes from 'prop-types';
import { Upload, Icon, Modal } from 'antd';
import './styles/style.css';

export default class PreviewImages extends Component {

	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: '',
			images: [],
		};

		this.handlePreview = this.handlePreview.bind(this);
	}

	componentDidMount() {
		const { images } = this.props;
		const putHeaders = {
      headers: {
        Authorization: `Bearer ${getJwt()}`,
      }
    };
    const imagesBase64 = [];
		images.forEach(image => {
			const { resourceId } = image;
			axios.get(`https://uw33cc3bz4.execute-api.us-west-2.amazonaws.com/dev/resource/${resourceId}`, putHeaders)
				.then(resource => {
					const imageBase64 = resource.data.split("base64")[1];
					const imageSrc = `data:image/png;base64,${imageBase64}`;
					imagesBase64.push(imageSrc);
					this.setState({
						images: imagesBase64,
					});
				});
		});
	}

	handleCancel() {
		this.setState({ 
			previewVisible: false,
		});
	}

	handlePreview(image) {
		this.setState({
			previewVisible: true,
			previewImage: image,
		});
	}

	render() {
		const { images, previewVisible, previewImage } = this.state;
		return (
			<div className="preview-images">
			{ images.map((image, index) => 
				<div className="image-wrapper" key={index}>
					<img src={image} onClick={() => this.handlePreview(image)} />
				</div>
			)}
			<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
				<img style={{ width: '100%' }} src={previewImage} />
			</Modal>
			</div>
		);
	}

}

PreviewImages.propTypes = {
	images: PropTypes.array
};

