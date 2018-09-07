import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';
import { Pagination, Tag } from 'antd';

import { integrationKeyFromFile, integrationLabelFromKey, integrationImageFromKey } from 'utils/dataIntegrations';
import { Spinner, ResultsList, FilesFilters } from 'components';
import AvatarWrapper from 'components/common/Avatar/AvatarWrapper';
import imageSrcFromFileExtension from 'lib/imageFiles';
import formatSize from 'lib/formatSize';
import String from 'translations';
import './styles/style.css';

const PAGE_SIZE = 20;

const formatTime = date =>
  String.t('timeActivityGraph.displayTime', {
    displayDate: moment(date).format(String.t('timeActivityGraph.dateFormat')),
    displayTime: moment(date).format(String.t('timeActivityGraph.timeFormat'))
  });

const findUserByFile = (users, file) => users.find(({ userId }) => userId === file.fileOwnerId) || {};

const getColumns = (keywords, caseSensitive, owners) => [
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName',
    sorter: (a, b) => a.fileName.localeCompare(b.fileName),
    render: (text, file) => (
      <a className="SearchPage__results__link" href={file.resourceUri} target="_blank" rel="noopener noreferrer">
        <img
          src={imageSrcFromFileExtension(file.fileExtension)}
          className="SearchPage__results__fileIcon"
          alt=""
          width={32}
          height={32}
        />
        <Highlighter
          className="SearchPage__results__fileName"
          highlightClassName="SearchPage__results-highlighted"
          searchWords={keywords}
          textToHighlight={text}
          caseSensitive={caseSensitive}
          autoEscape
        />
      </a>
    )
  },
  {
    title: 'Last Modified',
    dataIndex: 'lastModified',
    key: 'lastModified',
    sorter: (a, b) => moment(a.lastModified) - moment(b.lastModified),
    render: x => formatTime(x)
  },
  {
    title: 'Size',
    dataIndex: 'fileSize',
    key: 'fileSize',
    sorter: (a, b) => a.fileSize - b.fileSize,
    render: x => formatSize(x)
  },
  {
    title: 'Owner',
    dataIndex: 'fileOwnerId',
    key: 'fileOwnerId',
    sorter: (a, b) => {
      const nameA = findUserByFile(owners, a).fullName;
      const nameB = findUserByFile(owners, b).fullName;
      return nameA.localeCompare(nameB);
    },
    render: (text, file) => {
      const user = findUserByFile(owners, file);
      return (
        <div>
          <AvatarWrapper user={user} size="small" hideStatusTooltip />
          <span className="SearchPage__results__fileOwnerName">{user.fullName}</span>
        </div>
      );
    }
  },
  {
    title: 'Source',
    dataIndex: 'fileSource',
    key: 'fileSource',
    sorter: (a, b) => a.fileSource.localeCompare(b.fileSource),
    render: (text, file) => (
      <div>
        <div className="SearchPage__results__integrationIcon">
          <img src={integrationImageFromKey(integrationKeyFromFile(file))} width={26} height={26} alt="" />
        </div>
        <span className="SearchPage__results__integrationLabel">
          {integrationLabelFromKey(integrationKeyFromFile(file))}
        </span>
      </div>
    )
  }
];

class SearchPage extends Component {
  state = {
    excludeOwnersFilter: {},
    excludeTypesFilter: {},
    excludeIntegrationsFilter: {},
    page: 1
  };

  handleRemoveKeywordClick = keyword => {
    const { keywords, currentSubscriberOrgId, caseSensitive, andOperator } = this.props;
    const query = _.without(keywords, keyword).join(' ');
    this.props.search(query, currentSubscriberOrgId, caseSensitive, andOperator);
  };

  handleOwnerFilterClick = key => {
    const { excludeOwnersFilter } = this.state;
    this.setState({ excludeOwnersFilter: { ...excludeOwnersFilter, [key]: excludeOwnersFilter[key] ? null : true } });
  };

  handleIntegrationFilterClick = key => {
    const { excludeIntegrationsFilter } = this.state;
    this.setState({
      excludeIntegrationsFilter: { ...excludeIntegrationsFilter, [key]: excludeIntegrationsFilter[key] ? null : true }
    });
  };

  handleFileTypeFilterClick = key => {
    const { excludeTypesFilter } = this.state;
    this.setState({ excludeTypesFilter: { ...excludeTypesFilter, [key]: excludeTypesFilter[key] ? null : true } });
  };

  handleFileTypeFilterDoubleClick = () => {
    const { fileTypes } = this.props;
    const allSelected = Object.keys(this.state.excludeTypesFilter).length === fileTypes.length;
    const allFilters = fileTypes.reduce((obj, file) => ({ ...obj, [file.key]: true }), {});
    this.setState({ excludeTypesFilter: allSelected ? {} : allFilters });
  };

  handlePageChange = page => {
    this.setState({ page });
  };

  render() {
    const { loading, keywords, caseSensitive, results, owners, fileTypes, integrations } = this.props;
    const { page, excludeOwnersFilter, excludeIntegrationsFilter, excludeTypesFilter } = this.state;

    const resultsFiltered = results.filter(file => {
      const label = file.fileExtension || String.t('ckgPage.filterTypeOther');
      const integrationKey = integrationKeyFromFile(file);
      const ownerKey = file.fileOwnerId;
      return !excludeTypesFilter[label] && !excludeIntegrationsFilter[integrationKey] && !excludeOwnersFilter[ownerKey];
    });
    const resultsCount = resultsFiltered.length;

    return (
      <div className="SearchPage">
        <div className="SearchPage__header">
          <i className="SearchPage__icon fa fa-search" />
          <div className="SearchPage__title">
            <span className="SearchPage__results-count">{loading ? '...' : `${resultsCount}`}</span>
            {String.t('searchPage.title')}
          </div>
          <span className="SearchPage__keywords">
            {keywords.map(keyword => (
              <Tag
                closable
                key={keyword}
                className="SearchPage__tag"
                onClose={() => this.handleRemoveKeywordClick(keyword)}
                visible={keywords.includes(keyword)}
              >
                {keyword}
              </Tag>
            ))}
          </span>
          <span>
            <Pagination
              size="small"
              current={page}
              total={resultsCount}
              pageSize={PAGE_SIZE}
              onChange={this.handlePageChange}
            />
          </span>
        </div>
        <div className={classNames('SearchPage__results', { loading })}>
          {loading && <Spinner />}
          {!loading && (
            <div className="SearchPage__results-inner">
              <ResultsList
                columns={getColumns(keywords, caseSensitive, owners)}
                dataSource={resultsFiltered}
                loading={loading}
                rowKey="fileId"
                pagination={{
                  className: 'hidden',
                  pageSize: PAGE_SIZE,
                  current: page
                }}
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
  currentSubscriberOrgId: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  caseSensitive: PropTypes.bool,
  andOperator: PropTypes.bool,
  keywords: PropTypes.array,
  results: PropTypes.array,
  owners: PropTypes.array,
  fileTypes: PropTypes.array,
  integrations: PropTypes.array
};

SearchPage.defaultProps = {
  loading: false,
  caseSensitive: false,
  andOperator: false,
  keywords: [],
  results: [],
  owners: [],
  fileTypes: [],
  integrations: []
};

export default SearchPage;
