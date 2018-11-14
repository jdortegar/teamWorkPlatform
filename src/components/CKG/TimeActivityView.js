import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TimeActivityGraph, GraphZoomActions } from 'src/components';

class TimeActivityView extends Component {
  state = {
    zoomLevel: 0,
    viewAll: true
  };

  handleZoomIn = () => {
    this.setState(prevState => ({
      zoomLevel: prevState.zoomLevel + 1,
      viewAll: false
    }));
  };

  handleZoomOut = () => {
    this.setState(prevState => ({
      zoomLevel: prevState.zoomLevel - 1,
      viewAll: false
    }));
  };

  handleViewAll = () => {
    this.setState({ viewAll: true });
  };

  render() {
    const { files } = this.props;
    const { zoomLevel, viewAll } = this.state;
    return (
      <div className="TimeActivityView">
        <div className="ckg-tools-container">
          <div className="habla-ckg-tools">
            <GraphZoomActions
              onZoomIn={this.handleZoomIn}
              onZoomOut={this.handleZoomOut}
              onViewAll={this.handleViewAll}
            />
          </div>
        </div>
        <TimeActivityGraph files={files} zoomLevel={zoomLevel} viewAll={viewAll} />
      </div>
    );
  }
}

TimeActivityView.propTypes = {
  files: PropTypes.array
};

TimeActivityView.defaultProps = {
  files: []
};

export default TimeActivityView;
