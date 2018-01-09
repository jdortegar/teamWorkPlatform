import React from 'react';
import PropTypes from 'prop-types';
import EditButton from '../../components/buttons/EditButton';
import './styles/style.css';

const propTypes = {
  breadcrumb: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  icon: PropTypes.node.isRequired,
  editButton: PropTypes.object.isRequired
};


function SubpageHeader({ breadcrumb, icon, editButton = {} }) {
  const { showButton, isAdmin, url } = editButton;
  return (
    <div className="habla-main-content-header padding-class-a border-bottom-lighter">
      <div className="habla-main-content-header-title">
        {icon}
        <h1 className="Subpage-header__title habla-title margin-left-class-a">{breadcrumb}</h1>
      </div>
      <div className="habla-main-content-header-actions">
        {showButton && isAdmin && <EditButton url={url} />}
      </div>
    </div>
  );
}

SubpageHeader.propTypes = propTypes;

export default SubpageHeader;
