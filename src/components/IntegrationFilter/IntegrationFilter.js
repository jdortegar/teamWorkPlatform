import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from 'antd';

import {
  integrationLabelFromKey,
  integrationImageFromKey
} from 'utils/dataIntegrations';
import String from 'translations';
import './styles/style.css';

const propTypes = {
  integrationKey: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func
};

const defaultProps = {
  active: false,
  onClick: null
};

const IntegrationFilter = ({ integrationKey, count, active, onClick }) => {
  const label = integrationLabelFromKey(integrationKey);
  return (
    <div key={integrationKey} className="IntegrationFilter">
      <Tooltip placement="top" title={String.t('ckgPage.integrationFileCount', { count, label })}>
        <div
          className={classNames('IntegrationFilter__content', { inactive: !active })}
          onClick={onClick}
        >
          <img
            src={integrationImageFromKey(integrationKey)}
            className="IntegrationFilter__image"
            width={32}
            height={32}
            alt=""
          />
          <div className="IntegrationFilter__label">{label}</div>
        </div>
      </Tooltip>
    </div>
  );
};

IntegrationFilter.propTypes = propTypes;
IntegrationFilter.defaultProps = defaultProps;

export default IntegrationFilter;
