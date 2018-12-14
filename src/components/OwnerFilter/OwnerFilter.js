import React from 'react';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { BasicFilter, AvatarWrapper } from 'src/components';

const propTypes = {
  owner: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  tooltipTitle: PropTypes.string
};

const defaultProps = {
  active: false,
  onClick: null,
  tooltipTitle: undefined
};

const OwnerFilter = ({ owner, count, active, onClick, tooltipTitle }) => {
  const { firstName, lastName } = owner;
  const fullName = String.t('fullName', { firstName, lastName });
  const avatar = <AvatarWrapper size="default" user={owner} hidePresence hideStatusTooltip />;

  return (
    <BasicFilter
      tooltipTitle={tooltipTitle || String.t('ckgPage.ownerFileCount', { count, fullName })}
      label={fullName}
      avatar={avatar}
      active={active}
      onClick={onClick}
    />
  );
};

OwnerFilter.propTypes = propTypes;
OwnerFilter.defaultProps = defaultProps;

export default OwnerFilter;
