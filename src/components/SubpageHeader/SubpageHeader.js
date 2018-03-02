import React from 'react';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import String from '../../translations';
import EditButton from '../../components/buttons/EditButton';
import './styles/style.css';

const propTypes = {
  breadcrumb: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  icon: PropTypes.node,
  editButton: PropTypes.object
};

const defaultProps = {
  editButton: {},
  icon: null
};


function SubpageHeader({ breadcrumb, icon, editButton }) {
  const { showButton, isAdmin, url } = editButton;
  return (
    <div className="habla-main-content-header padding-class-a border-bottom-lighter">
      <div className="habla-main-content-header-title">
        {icon}
        <h1 className="Subpage-header__title habla-title">{breadcrumb}</h1>
      </div>
      <div className="habla-main-content-header-actions">
        <Tooltip placement="top" title={String.t('subPageHeader.linkToCKG')}>
          <Link to="/app/ckg"><div className="ckg-link"><i className="fas fa-chart-area" /></div></Link>
        </Tooltip>
        {showButton && isAdmin && <EditButton url={url} />}
      </div>
    </div>
  );
}

SubpageHeader.propTypes = propTypes;
SubpageHeader.defaultProps = defaultProps;

export default SubpageHeader;
