import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  IntegrationFilter,
  FileTypeFilter
} from 'components';
import String from 'translations';
import './styles/style.css';

const propTypes = {
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
  excludeIntegrationsFilter: PropTypes.object,
  excludeTypesFilter: PropTypes.object,
  onIntegrationFilterClick: PropTypes.func,
  onFileTypeFilterClick: PropTypes.func,
  onFileTypeFilterDoubleClick: PropTypes.func
};

const defaultProps = {
  fileTypes: [],
  integrations: [],
  className: null,
  excludeIntegrationsFilter: {},
  excludeTypesFilter: {},
  onIntegrationFilterClick: null,
  onFileTypeFilterClick: null,
  onFileTypeFilterDoubleClick: null
};

const FilesFilters = ({
  className,
  fileTypes,
  integrations,
  excludeIntegrationsFilter,
  excludeTypesFilter,
  onIntegrationFilterClick,
  onFileTypeFilterClick,
  onFileTypeFilterDoubleClick
}) => (
  <div className={classNames('FilesFilters', className)}>
    <div className="FilesFilters__content">
      {integrations.map(({ key, count }) => (
        <IntegrationFilter
          key={key}
          integrationKey={key}
          count={count}
          active={!excludeIntegrationsFilter[key]}
          onClick={() => onIntegrationFilterClick(key)}
        />
      ))}
      <div className="FilesFilters__dataTypes habla-label">
        {(fileTypes.length > 0) && (
          <span className="FilesFilters__dataTypes__badge">
            {fileTypes.length}
          </span>
        )}
        {String.t('ckgPage.filterTypes', { count: fileTypes.length })}
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
);

FilesFilters.propTypes = propTypes;
FilesFilters.defaultProps = defaultProps;

export default FilesFilters;
