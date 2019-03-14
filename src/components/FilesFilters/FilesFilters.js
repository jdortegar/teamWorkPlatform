import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import String from 'src/translations';
import { IntegrationFilter, FileTypeFilter, OwnerFilter } from 'src/components';
import { Popover } from 'antd';
import './styles/style.css';

const propTypes = {
  owners: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired
    })
  ),
  fileTypes: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      fileExtension: PropTypes.string
    })
  ),
  integrations: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired
    })
  ),
  className: PropTypes.string,
  excludeOwnersFilter: PropTypes.object,
  excludeIntegrationsFilter: PropTypes.object,
  excludeTypesFilter: PropTypes.object,
  onOwnerFilterClick: PropTypes.func,
  onIntegrationFilterClick: PropTypes.func,
  onFileTypeFilterClick: PropTypes.func,
  onFileTypeFilterDoubleClick: PropTypes.func,
  orgId: PropTypes.string.isRequired,
  team: PropTypes.object
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
  onFileTypeFilterDoubleClick: () => {},
  team: null
};

class FilesFilters extends React.Component {
  state = {
    filesVisible: false,
    integrationVisible: false,
    ownersVisible: false
  };

  handleFilesVisibleChange = visible => {
    this.setState({ filesVisible: visible });
  };

  handleIntegrationsVisibleChange = visible => {
    this.setState({ integrationVisible: visible });
  };

  handleOwnersVisibleChange = visible => {
    this.setState({ ownersVisible: visible });
  };

  renderEmptyMessage = () => {
    const { team, orgId } = this.props;
    return (
      <div className="FilesFilters__content">
        <div className="FilesFilters__dataTypes habla-label">
          <div className="FilesFilters__dataTypes__text">
            <Link
              to={team ? `/app/teamIntegrations/${team.teamId}` : `/app/integrations/${orgId}`}
              className="FilesFilters_add-data-link"
            >
              {String.t('ckgPage.noData')}
            </Link>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
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
    } = this.props;

    if (fileTypes.length === 0 || integrations.length === 0 || owners.length === 0) {
      return <div className={classNames('FilesFilters', className)}>{this.renderEmptyMessage()}</div>;
    }

    return (
      <div className={classNames('FilesFilters', className)}>
        <div className="FilesFilters__content">
          {owners.length > 0 && (
            <div className="FilesFilters__group">
              <div className="FilesFilters__dataTypes habla-label">
                <span className="FilesFilters__dataTypes__badge">{owners.length}</span>
              </div>
              {owners.slice(0, 5).map(owner => (
                <OwnerFilter
                  key={owner.key}
                  owner={owner}
                  count={owner.count}
                  active={!excludeOwnersFilter[owner.key]}
                  onClick={() => onOwnerFilterClick(owner.key)}
                />
              ))}
              {owners.length > 5 && (
                <div className="Filter_Popover">
                  <Popover
                    placement="topLeft"
                    content={
                      <div className="Popover_container">
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
                    }
                    title={String.t('ckgPage.teamMembers', { count: owners.length })}
                    trigger="click"
                    visible={this.state.ownersVisible}
                    onVisibleChange={this.handleOwnersVisibleChange}
                  >
                    <div className="Filters_ellipsis_icon">
                      <i className="fa fa-ellipsis-h" />
                    </div>
                  </Popover>
                </div>
              )}
            </div>
          )}
          <div className="FilesFilters__group">
            <div className="FilesFilters__dataTypes habla-label">
              <span className="FilesFilters__dataTypes__badge">{integrations.length}</span>
            </div>
            {integrations.slice(0, 5).map(({ key, count }) => (
              <IntegrationFilter
                key={key}
                integrationKey={key}
                count={count}
                active={!excludeIntegrationsFilter[key]}
                onClick={() => onIntegrationFilterClick(key)}
              />
            ))}
            {integrations.length > 5 && (
              <div className="Filter_Popover">
                <Popover
                  placement="topLeft"
                  content={
                    <div className="Popover_container">
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
                  }
                  title={String.t('ckgPage.dataIntegration', { count: integrations.length })}
                  trigger="click"
                  visible={this.state.integrationVisible}
                  onVisibleChange={this.handleIntegrationsVisibleChange}
                >
                  <div className="Filters_ellipsis_icon">
                    <i className="fa fa-ellipsis-h" />
                  </div>
                </Popover>
              </div>
            )}
          </div>
          <div className="FilesFilters__group">
            <div className="FilesFilters__dataTypes habla-label">
              <span className="FilesFilters__dataTypes__badge">{fileTypes.length}</span>
            </div>
            {fileTypes.slice(0, 5).map(({ key, count, label, fileExtension }) => (
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
            {fileTypes.length > 5 && (
              <div className="Filter_Popover">
                <Popover
                  placement="topLeft"
                  content={
                    <div className="Popover_container">
                      {fileTypes.map(({ key, count, label, fileExtension }) => (
                        <FileTypeFilter
                          key={key}
                          count={count}
                          label={label}
                          fileExtension={fileExtension}
                          active={!excludeTypesFilter[key]}
                          onClick={() => onFileTypeFilterClick(key)}
                          onDoubleClick={onFileTypeFilterDoubleClick}
                          showLabel
                        />
                      ))}
                    </div>
                  }
                  title={String.t('ckgPage.fileTypes', { count: fileTypes.length })}
                  trigger="click"
                  visible={this.state.filesVisible}
                  onVisibleChange={this.handleFilesVisibleChange}
                >
                  <div className="Filters_ellipsis_icon">
                    <i className="fa fa-ellipsis-h" />
                  </div>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

FilesFilters.propTypes = propTypes;
FilesFilters.defaultProps = defaultProps;

export default FilesFilters;
