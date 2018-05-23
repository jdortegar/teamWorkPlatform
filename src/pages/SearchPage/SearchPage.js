import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import {
  integrationKeyFromFile,
  integrationLabelFromKey,
  integrationImageFromKey
} from 'utils/dataIntegrations';
import { Spinner, ResultsList, FilesFilters } from 'components';
import AvatarWrapper from 'components/common/Avatar/AvatarWrapper';
import imageSrcFromFileExtension from 'lib/imageFiles';
import formatSize from 'lib/formatSize';
import String from 'translations';
import './styles/style.css';

const formatTime = date => String.t('timeActivityGraph.displayTime', {
  displayDate: moment(date).format(String.t('timeActivityGraph.dateFormat')),
  displayTime: moment(date).format(String.t('timeActivityGraph.timeFormat'))
});

const getColumns = owners => [
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName',
    sorter: (a, b) => a.fileName.localeCompare(b.fileName),
    render: (text, file) => (
      <a className="SearchPage__results__link" href={file.resourceUri} target="_blank">
        <img
          src={imageSrcFromFileExtension(file.fileExtension)}
          className="SearchPage__results__fileIcon"
          alt=""
          width={32}
          height={32}
        />
        <span className="SearchPage__results__fileName">{text}</span>
      </a>
    )
  }, {
    title: 'Last Modified',
    dataIndex: 'lastModified',
    key: 'lastModified',
    sorter: (a, b) => moment(a.lastModified) - moment(b.lastModified),
    render: x => formatTime(x)
  }, {
    title: 'Size',
    dataIndex: 'fileSize',
    key: 'fileSize',
    sorter: (a, b) => a.fileSize - b.fileSize,
    render: x => formatSize(x)
  }, {
    title: 'Owner',
    dataIndex: 'fileOwnerName',
    key: 'fileOwnerName',
    sorter: (a, b) => a.fileOwnerName.localeCompare(b.fileOwnerName),
    render: (text, file) => (
      <div>
        <AvatarWrapper
          user={owners.find(({ userId }) => userId === file.fileOwnerId)}
          size="small"
          hideStatusTooltip
        />
        <span className="SearchPage__results__fileOwnerName">{text}</span>
      </div>
    )
  }, {
    title: 'Source',
    dataIndex: 'fileSource',
    key: 'fileSource',
    sorter: (a, b) => a.fileSource.localeCompare(b.fileSource),
    render: (_, file) => (
      <div>
        <div className="SearchPage__results__integrationIcon">
          <img
            src={integrationImageFromKey('box')}
            width={26}
            height={26}
            alt=""
          />
        </div>
        <span className="SearchPage__results__integrationLabel">
          {integrationLabelFromKey(integrationKeyFromFile(file))}
        </span>
      </div>
    )
  }
];

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.updateSearch(props.queryParams.q);
  }

  state = {
    query: this.props.query,
    excludeOwnersFilter: {},
    excludeTypesFilter: {},
    excludeIntegrationsFilter: {}
  }

  componentWillReceiveProps(nextProps) {
    this.updateSearch(nextProps.queryParams.q, true);
  }

  updateSearch(newQuery, shouldUpdateState = false) {
    if (!newQuery || newQuery === this.props.query) return;
    if (shouldUpdateState) this.setState({ query: newQuery });
    this.props.search(newQuery, this.props.currentSubscriberOrgId);
  }

  handleOwnerFilterClick = (key) => {
    const { excludeOwnersFilter } = this.state;
    this.setState({ excludeOwnersFilter: { ...excludeOwnersFilter, [key]: excludeOwnersFilter[key] ? null : true } });
  }

  handleIntegrationFilterClick = (key) => {
    const { excludeIntegrationsFilter } = this.state;
    this.setState({ excludeIntegrationsFilter: { ...excludeIntegrationsFilter, [key]: excludeIntegrationsFilter[key] ? null : true } });
  }

  handleFileTypeFilterClick = (key) => {
    const { excludeTypesFilter } = this.state;
    this.setState({ excludeTypesFilter: { ...excludeTypesFilter, [key]: excludeTypesFilter[key] ? null : true } });
  }

  handleFileTypeFilterDoubleClick = () => {
    const { fileTypes } = this.props;
    const allSelected = Object.keys(this.state.excludeTypesFilter).length === fileTypes.length;
    const allFilters = fileTypes.reduce((obj, file) => ({ ...obj, [file.key]: true }), {});
    this.setState({ excludeTypesFilter: allSelected ? {} : allFilters });
  }

  render() {
    const { loading, results, owners, fileTypes, integrations } = this.props;
    const { query, excludeOwnersFilter, excludeIntegrationsFilter, excludeTypesFilter } = this.state;

    const resultsFiltered = results.filter((file) => {
      const label = file.fileExtension || String.t('ckgPage.filterTypeOther');
      const integrationKey = integrationKeyFromFile(file);
      const ownerKey = file.fileOwnerId;
      return !excludeTypesFilter[label] && !excludeIntegrationsFilter[integrationKey] && !excludeOwnersFilter[ownerKey];
    });

    return (
      <div className="SearchPage">
        <div className="SearchPage__header">
          <i className="SearchPage__icon fa fa-search" />
          <div className="SearchPage__title">
            {String.t('searchPage.title')}
            <span className="SearchPage__query">&ldquo;{query}&rdquo;</span>
          </div>
        </div>
        <div className={classNames('SearchPage__results', { loading })}>
          {loading && <Spinner />}
          {!loading && (
            <div className="SearchPage__results-inner">
              <ResultsList
                columns={getColumns(owners)}
                dataSource={resultsFiltered}
                loading={loading}
                rowKey="fileId"
              />
              <div className="SearchPage__bottomBar">
                <FilesFilters
                  owners={owners}
                  fileTypes={fileTypes}
                  integrations={integrations}
                  excludeOwnersFilter={excludeOwnersFilter}
                  excludeIntegrationsFilter={excludeIntegrationsFilter}
                  excludeTypesFilter={excludeTypesFilter}
                  onOwnerFilterClick={this.handleOwnerFilterClick}
                  onIntegrationFilterClick={this.handleIntegrationFilterClick}
                  onFileTypeFilterClick={this.handleFileTypeFilterClick}
                  onFileTypeFilterDoubleClick={this.handleFileTypeFilterDoubleClick}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

SearchPage.propTypes = {
  loading: PropTypes.bool,
  query: PropTypes.string,
  results: PropTypes.array,
  owners: PropTypes.array,
  fileTypes: PropTypes.array,
  integrations: PropTypes.array,
  search: PropTypes.func,
  queryParams: PropTypes.shape({
    q: PropTypes.string
  }).isRequired,
  currentSubscriberOrgId: PropTypes.string.isRequired
};

SearchPage.defaultProps = {
  loading: false,
  query: '',
  results: [],
  owners: [],
  fileTypes: [],
  integrations: [],
  search: null
};

export default SearchPage;
