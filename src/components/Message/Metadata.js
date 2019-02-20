import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/style.css';

import { Spinner } from 'src/components';

const propTypes = {
  url: PropTypes.string.isRequired,
  fetchMetadata: PropTypes.func.isRequired
};

class Metadata extends Component {
  state = {
    urlMetadata: null,
    loadingMetadata: false
  };

  componentDidMount() {
    const { url } = this.props;

    this.setState({
      loadingMetadata: true
    });

    this.props
      .fetchMetadata(url)
      .then(response => {
        const urlMetadata = response.data;

        this.setState({
          urlMetadata,
          loadingMetadata: false
        });
      })
      .catch(() => {
        this.setState({ urlMetadata: null, loadingMetadata: false });
      });
  }

  render() {
    const { urlMetadata, loadingMetadata } = this.state;

    if (loadingMetadata || !urlMetadata) return <Spinner />;

    let imageUrl = null;
    if (urlMetadata.image) {
      imageUrl = urlMetadata.image;
    } else if (urlMetadata.images !== undefined || urlMetadata.images.length > 0) {
      imageUrl = urlMetadata.image ? urlMetadata.image : urlMetadata.images[0];
    }

    return (
      <div className="message__meta_url">
        <a href={urlMetadata.url} target="blank">
          {urlMetadata.title}
        </a>
        <p>{urlMetadata.description}</p>
        {imageUrl && <img src={imageUrl} alt={urlMetadata.description} />}
      </div>
    );
  }
}

Metadata.propTypes = propTypes;

export default Metadata;
