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
  ckgLink: PropTypes.object,
  editButton: PropTypes.object
};

const defaultProps = {
  ckgLink: {},
  editButton: {}
};


function SubpageHeader({ breadcrumb, subscriberOrgId, history, editButton, ckgLink }) {
  const { showButton, isAdmin, url } = editButton;
  return (
    <div className="habla-main-content-header padding-class-a border-bottom-lighter flexClass">
      <div className="habla-main-content-header-title">
        <h1 className="Subpage-header__title habla-title">{breadcrumb}</h1>
      </div>
      <div className="habla-main-content-header-actions">
        {Object.keys(ckgLink).length > 0 &&
        <Tooltip placement="top" title={String.t('subPageHeader.linkToCKG')}>
          <div
            className="ckg-link"
            onClick={() => {
              history.push(`/app/ckg/${subscriberOrgId}`, { ...ckgLink });
            }}
          >
            <i className="fas fa-chart-area" />
          </div>
        </Tooltip>
        }
      </div>
      {showButton && isAdmin && <EditButton url={url} />}
    </div>
  );
}

SubpageHeader.propTypes = propTypes;
SubpageHeader.defaultProps = defaultProps;

export default SubpageHeader;
