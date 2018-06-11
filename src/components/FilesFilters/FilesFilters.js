import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  IntegrationFilter,
  FileTypeFilter,
  OwnerFilter
} from 'components';
import String from 'translations';
import './styles/style.css';

const propTypes = {
  owners: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired
  })),
  fileTypes: PropTypes.arrayOf(PropTypes.shape({
    count: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    fileExtension: PropTypes.string
  })),
  integrations: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired
  })),
  className: PropTypes.string,
  excludeOwnersFilter: PropTypes.object,
  excludeIntegrationsFilter: PropTypes.object,
  excludeTypesFilter: PropTypes.object,
  onOwnerFilterClick: PropTypes.func,
  onIntegrationFilterClick: PropTypes.func,
  onFileTypeFilterClick: PropTypes.func,
  onFileTypeFilterDoubleClick: PropTypes.func
};

const defaultProps = {
  owners: [],
  fileTypes: [],
  integrations: [],
  className: null,
  excludeOwnersFilter: {},
  excludeIntegrationsFilter: {},
  excludeTypesFilter: {},
  onOwnerFilterClick: null,
  onIntegrationFilterClick: null,
  onFileTypeFilterClick: null,
  onFileTypeFilterDoubleClick: null
};

const FilesFilters = ({
  className,
  owners,
  fileTypes,
  integrations,
  excludeOwnersFilter,
  excludeIntegrationsFilter,
  excludeTypesFilter,
  onOwnerFilterClick,
  onIntegrationFilterClick,
  onFileTypeFilterClick,
  onFileTypeFilterDoubleClick
}) => {
  if (fileTypes.length === 0 || integrations.length === 0) {
    return (
      <div className={classNames('FilesFilters', className)}>
        <div className="FilesFilters__content">
          <div className="FilesFilters__dataTypes habla-label">
            <div className="FilesFilters__dataTypes__text">{String.t('ckgPage.noData')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames('FilesFilters', className)}>
      <div className="FilesFilters__content">
        {owners.length > 0 && (
          <div className="FilesFilters__group">
            <div className="FilesFilters__dataTypes habla-label">
              <span className="FilesFilters__dataTypes__badge">{owners.length}</span>
            </div>
            {owners.map(owner => (
              <OwnerFilter
                key={owner.key}
                owner={owner}
                count={owner.count}
                active={!excludeOwnersFilter[owner.key]}
                onClick={() => onOwnerFilterClick(owner.key)}
              />
            ))}
          </div>
        )}
        <div className="FilesFilters__group">
          <div className="FilesFilters__dataTypes habla-label">
            <span className="FilesFilters__dataTypes__badge">{integrations.length}</span>
          </div>
          {integrations.map(({ key, count }) => (
            <IntegrationFilter
              key={key}
              integrationKey={key}
              count={count}
              active={!excludeIntegrationsFilter[key]}
              onClick={() => onIntegrationFilterClick(key)}
            />
          ))}
        </div>
        <div className="FilesFilters__group">
          <div className="FilesFilters__dataTypes habla-label">
            <span className="FilesFilters__dataTypes__badge">{fileTypes.length}</span>
          </div>
          {fileTypes.map(({ key, count, label, fileExtension }) => (
            <FileTypeFilter
              key={key}
              count={count}
              label={label}
              fileExtension={fileExtension}
              active={!excludeTypesFilter[key]}
              onClick={() => onFileTypeFilterClick(key)}
              onDoubleClick={onFileTypeFilterDoubleClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

FilesFilters.propTypes = propTypes;
FilesFilters.defaultProps = defaultProps;

export default FilesFilters;
