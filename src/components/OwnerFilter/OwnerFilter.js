import React from 'react';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { BasicFilter } from 'src/components';
import { AvatarWrapper } from 'src/containers';

const propTypes = {
  owner: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  tooltipTitle: PropTypes.string,
  showTooltip: PropTypes.bool
};

const defaultProps = {
  active: false,
  onClick: null,
  tooltipTitle: undefined,
  showTooltip: true
};

const OwnerFilter = ({ owner, count, active, onClick, tooltipTitle, showTooltip }) => {
  const { firstName, lastName } = owner;
  const fullName = String.t('fullName', { firstName, lastName });
  const avatar = (
    <AvatarWrapper size="default" user={owner} hidePresence hideStatusTooltip showDetails={!showTooltip} />
  );

  return (
    <BasicFilter
      tooltipTitle={tooltipTitle || String.t('ckgPage.ownerFileCount', { count, fullName })}
      label={fullName}
      avatar={avatar}
      active={active}
      onClick={onClick}
      showTooltip={showTooltip}
    />
  );
};

OwnerFilter.propTypes = propTypes;
OwnerFilter.defaultProps = defaultProps;

export default OwnerFilter;
