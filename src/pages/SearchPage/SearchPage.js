import React from 'react';
import moment from 'moment';

import {
  integrationKeyFromFile,
  integrationLabelFromKey
} from 'utils/dataIntegrations';
import { ResultsList } from 'components';
import imageSrcFromFileExtension from 'lib/imageFiles';
import formatSize from 'lib/formatSize';
import String from 'translations';
import sampleData from './sample-data.json';
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

// TODO: get this from the search bar
const query = 'knowledge graph';

const SearchPage = () => (
  <div className="SearchPage">
    <div className="SearchPage__header">
      <i className="SearchPage__icon fa fa-search" />
      <div className="SearchPage__title">
        {String.t('searchPage.title')}
        <span className="SearchPage__query">&ldquo;{query}&rdquo;</span>
      </div>
    </div>
    <div className="SearchPage__results">
      <ResultsList columns={columns} dataSource={sampleData} rowKey="fileId" />
    </div>
  </div>
);

export default SearchPage;
