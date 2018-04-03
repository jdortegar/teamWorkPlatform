import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import {
  integrationKeyFromFile,
  integrationLabelFromKey
} from 'utils/dataIntegrations';
import { Spinner, ResultsList } from 'components';
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
      <div>
        <img
          src={imageSrcFromFileExtension(file.fileExtension)}
          className="SearchPage__results__fileIcon"
          alt=""
          width={32}
          height={32}
        />
        <span className="SearchPage__results__fileName">{text}</span>
      </div>
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

  state = { query: this.props.query }

  componentWillReceiveProps(nextProps) {
    this.updateSearch(nextProps.queryParams.q, true);
  }

  updateSearch(newQuery, shouldUpdateState = false) {
    if (!newQuery || newQuery === this.props.query) return;
    if (shouldUpdateState) this.setState({ query: newQuery });
    this.props.search(newQuery);
  }

  render() {
    const { loading, results } = this.props;
    const { query } = this.state;
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
          {loading ? <Spinner /> : (
            <ResultsList
              columns={columns}
              dataSource={results}
              loading={loading}
              rowKey="fileId"
            />
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
  search: PropTypes.func,
  queryParams: PropTypes.shape({
    q: PropTypes.string
  }).isRequired
};

SearchPage.defaultProps = {
  loading: false,
  query: '',
  results: [],
  search: null
};

export default SearchPage;
