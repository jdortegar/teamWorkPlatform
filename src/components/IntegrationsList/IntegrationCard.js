import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import {
  integrationIsSupported,
  integrationLabelFromKey,
  integrationExtraImageFromKey
} from 'src/utils/dataIntegrations';
import { ImageCard } from 'src/components';

const propTypes = {
  source: PropTypes.string.isRequired,
  url: PropTypes.string,
  integration: PropTypes.object
};

const defaultProps = {
  url: '',
  integration: null
};

const renderBadge = integration => {
  if (!integration) return null;
  const { expired, revoked } = integration;
  if (expired) {
    return <i className="fa fa-times-circle habla-red" />;
  }
  if (typeof revoked === 'undefined' || revoked === false) {
    return <i className="fa fa-check-circle icon_success habla-green" />;
  }
  return null;
};

const IntegrationCard = ({ integration, source, url }) => {
  const isSupported = integrationIsSupported(source);
  const card = (
    <ImageCard
      className="IntegrationCard"
      imgSrc={integrationExtraImageFromKey(source)}
      extra={renderBadge(integration)}
    />
  );

  return (
    <div key={source} className={classNames('Integration', { inactive: !isSupported })}>
      <Tooltip placement="top" title={integrationLabelFromKey(source)}>
        {isSupported ? <Link to={url}>{card}</Link> : card}
      </Tooltip>
      <div className="Integration__label habla-label align-center-class card-label">
        {integrationLabelFromKey(source)}
      </div>
    </div>
  );
};

IntegrationCard.propTypes = propTypes;
IntegrationCard.defaultProps = defaultProps;

export default IntegrationCard;
