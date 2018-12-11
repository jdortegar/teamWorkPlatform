import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

import String from 'src/translations';
import 'src/pages/CKGPage/styles/style.css';

const propTypes = {
  onZoomIn: PropTypes.func,
  onZoomOut: PropTypes.func,
  onViewAll: PropTypes.func
};

const defaultProps = {
  onZoomIn: null,
  onZoomOut: null,
  onViewAll: null
};

// disable zoom controls until feature implementation
const ZOOM_CONTROLS_VISIBLE = false;

const GraphZoomActions = ({ onZoomIn, onZoomOut, onViewAll }) => (
  <div className="habla-ckg-tools-bar habla-ckg-actions-selector">
    {ZOOM_CONTROLS_VISIBLE && (
      <Tooltip
        arrowPointAtCenter
        placement="bottom"
        title={String.t('graphZoomActions.zoomInLabel')}
        onClick={onZoomIn}
      >
        <a>
          <i className="fas fa-search-plus" />
        </a>
      </Tooltip>
    )}
    {ZOOM_CONTROLS_VISIBLE && (
      <Tooltip
        arrowPointAtCenter
        placement="bottom"
        title={String.t('graphZoomActions.zoomOutLabel')}
        onClick={onZoomOut}
      >
        <a>
          <i className="fas fa-search-minus" />
        </a>
      </Tooltip>
    )}
    <Tooltip
      arrowPointAtCenter
      placement="bottom"
      title={String.t('graphZoomActions.viewAllLabel')}
      onClick={onViewAll}
    >
      <a className="no-border">
        <i className="fa fa-expand" />
      </a>
    </Tooltip>
  </div>
);

GraphZoomActions.propTypes = propTypes;
GraphZoomActions.defaultProps = defaultProps;

export default GraphZoomActions;
