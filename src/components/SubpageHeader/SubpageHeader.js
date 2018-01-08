import React from 'react';
import PropTypes from 'prop-types';
import EditButton from '../../components/buttons/EditButton';
import './styles/style.css';

const propTypes = {
  breadcrumb: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  node: PropTypes.node,
  icon: PropTypes.node.isRequired,
  editButton: PropTypes.object.isRequired
};

const defaultProps = {
  node: <span className="habla-label">Account Settings <i className="fa fa-cog" /></span>
};

function SubpageHeader({ breadcrumb, node, icon, editButton = {} }) {
  const { showButton, isAdmin, url } = editButton;
  return (
    <div className="habla-main-content-header padding-class-a border-bottom-lighter">
      <div className="habla-main-content-header-title">
        {icon}
        <h1 className="Subpage-header__title habla-title">{breadcrumb}</h1>
        {showButton && isAdmin && <EditButton url={url} />}
      </div>
      <div className="habla-main-content-header-actions">
        {node}
      </div>
    </div>
  );
}

SubpageHeader.propTypes = propTypes;
SubpageHeader.defaultProps = defaultProps;

export default SubpageHeader;
