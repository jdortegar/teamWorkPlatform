import React from 'react';
import PropTypes from 'prop-types';

import { BasicFilter } from 'components';
import AvatarWrapper from 'components/common/Avatar/AvatarWrapper';
import String from 'translations';

const propTypes = {
  owner: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func
};

const defaultProps = {
  active: false,
  onClick: null
};

const OwnerFilter = ({ owner, count, active, onClick }) => {
  const { firstName, lastName } = owner;
  const fullName = String.t('fullName', { firstName, lastName });
  const avatar = <AvatarWrapper size="default" user={owner} hidePresence hideStatusTooltip />;

  return (
    <BasicFilter
      tooltipTitle={String.t('ckgPage.ownerFileCount', { count, fullName })}
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
