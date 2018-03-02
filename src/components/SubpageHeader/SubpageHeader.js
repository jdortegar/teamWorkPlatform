import React from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import String from '../../translations';
import EditButton from '../../components/buttons/EditButton';
import './styles/style.css';

const propTypes = {
  subscriberOrgId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  breadcrumb: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  ckgLink: PropTypes.bool,
  editButton: PropTypes.object
};

const defaultProps = {
  ckgLink: false,
  editButton: {}
};


function SubpageHeader({ breadcrumb, subscriberOrgId, history, editButton, ckgLink }) {
  const { showButton, isAdmin, url } = editButton;
  return (
    <div className="habla-main-content-header padding-class-a border-bottom-lighter">
      <div className="habla-main-content-header-title">
        <h1 className="Subpage-header__title habla-title">{breadcrumb}</h1>
      </div>
      <div className="habla-main-content-header-actions">
        {ckgLink &&
        <Tooltip placement="top" title={String.t('subPageHeader.linkToCKG')}>
          <div
            className="ckg-link"
            onClick={() => {
              history.push(`/app/ckg/${subscriberOrgId}`);
            }}
          >
            <i className="fas fa-chart-area" />
          </div>
        </Tooltip>
        }
        {showButton && isAdmin && <EditButton url={url} />}
      </div>
    </div>
  );
}

SubpageHeader.propTypes = propTypes;
SubpageHeader.defaultProps = defaultProps;

export default SubpageHeader;
