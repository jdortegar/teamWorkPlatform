import React, { Component } from 'react';
import axios from 'axios';
import { getJwt } from '../../session';
import PropTypes from 'prop-types';

export default class PreviewImages extends Component {

	constructor(props) {
		super(props);
		this.state = {
			image: null,
		};
	}

	componentDidMount() {
		const { images } = this.props;
		const { resourceId } = images;
		const putHeaders = {
      headers: {
        Authorization: `Bearer ${getJwt()}`,
      }
    };
    axios.get(`https://uw33cc3bz4.execute-api.us-west-2.amazonaws.com/dev/resource/${resourceId}`, putHeaders)
    .then(resource => {
      // console.log(resource.data);
      const imageBase64 = resource.data.split("base64")[1];
      console.log(resource);
      const imageSrc = `data:image/png;base64,${imageBase64}`;
      this.setState({
      	image: imageSrc
      });
    });
	}

	render() {
		const { image } = this.state;
		// console.log(image);
		return (
			<div>
			{ image && <img src={image} /> }
			</div>
		);
	}

}

PreviewImages.propTypes = {
	images: PropTypes.object
};

