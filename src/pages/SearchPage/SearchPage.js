import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import {
  integrationKeyFromFile,
  integrationLabelFromKey
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

const columns = [
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName',
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
    render: x => formatTime(x)
  }, {
    title: 'Size',
    dataIndex: 'fileSize',
    key: 'fileSize',
    render: x => formatSize(x)
  }, {
    title: 'Owner',
    dataIndex: 'fileOwnerName',
    key: 'fileOwnerName',
    render: (text, file) => (
      <div>
        <AvatarWrapper
          user={file.owner}
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
    render: (_, file) => integrationLabelFromKey(integrationKeyFromFile(file))
  }
];

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.updateSearch(props.queryParams.q);
  }

  state = {
    query: this.props.query,
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
    const { loading, results, fileTypes, integrations } = this.props;
    const { query, excludeIntegrationsFilter, excludeTypesFilter } = this.state;

    const resultsFiltered = results.filter((file) => {
      const label = file.fileExtension || String.t('ckgPage.filterTypeOther');
      const key = integrationKeyFromFile(file);
      return !excludeTypesFilter[label] && !excludeIntegrationsFilter[key];
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
                columns={columns}
                dataSource={resultsFiltered}
                loading={loading}
                rowKey="fileId"
              />
              <div className="SearchPage__bottomBar">
                <FilesFilters
                  fileTypes={fileTypes}
                  integrations={integrations}
                  excludeIntegrationsFilter={excludeIntegrationsFilter}
                  excludeTypesFilter={excludeTypesFilter}
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
  fileTypes: [],
  integrations: [],
  search: null
};

export default SearchPage;
