import React from 'react';
import PropTypes from 'prop-types';

import { BasicFilter } from 'components';
import {
  integrationLabelFromKey,
  integrationImageFromKey
} from 'utils/dataIntegrations';
import String from 'translations';

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
    <BasicFilter
      tooltipTitle={String.t('ckgPage.integrationFileCount', { count, label })}
      imageSource={integrationImageFromKey(integrationKey)}
      label={label}
      active={active}
      onClick={onClick}
    />
  );
};

IntegrationFilter.propTypes = propTypes;
IntegrationFilter.defaultProps = defaultProps;

export default IntegrationFilter;
