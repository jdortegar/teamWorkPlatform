import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';
import String from '../../translations';
import formatSize from '../../lib/formatSize';

import { NewSubpageHeader, TimeActivityGraph } from '../../components';
import './styles/style.css';

const color = d3.scaleOrdinal(d3.schemeCategory10);
const buildTime = dateTime => moment().startOf('day').set({
  hour: dateTime.hour(),
  minute: dateTime.minutes(),
  second: dateTime.seconds()
});

const buildDataObject = (file) => {
  const dateTime = moment(file.lastModified);
  const displayTimestamp = `${moment(dateTime).format(String.t('timeActivityGraph.dateFormat'))} ${moment(dateTime).format(String.t('timeActivityGraph.timeFormat'))}`;
  const fileName = file.fileName;
  const fileSize = formatSize(file.fileSize);
  const fileUri = file.resourceUri;

  return {
    ...file,
    date: dateTime,
    time: buildTime(dateTime),
    displayDate: moment(dateTime).format(String.t('timeActivityGraph.dateFormat')),
    displayTime: moment(dateTime).format(String.t('timeActivityGraph.timeFormat')),
    color: color(file.fileExtension),
    label: `${fileName} \n ${displayTimestamp} \n ${fileSize} \n (click to open)`
  };
};

const propTypes = {
  currentSubscriberOrgId: PropTypes.string,
  fetchTimeActivitiesBySubscriberOrgId: PropTypes.func.isRequired,
  timeActivities: PropTypes.object
};

const defaultProps = {
  currentSubscriberOrgId: null,
  timeActivities: null
};

class CKGPage extends Component {
  componentDidMount() {
    const { currentSubscriberOrgId, fetchTimeActivitiesBySubscriberOrgId } = this.props;
    if (currentSubscriberOrgId) {
      fetchTimeActivitiesBySubscriberOrgId(currentSubscriberOrgId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentSubscriberOrgId, fetchTimeActivitiesBySubscriberOrgId } = this.props;
    if (currentSubscriberOrgId !== nextProps.currentSubscriberOrgId) {
      fetchTimeActivitiesBySubscriberOrgId(nextProps.currentSubscriberOrgId);
    }
  }

  render() {
    if (!this.props.timeActivities) return null;
    const { files } = this.props.timeActivities;

    return (
      <div className="CKGPage">
        <NewSubpageHeader>
          <div className="CKGPage__title display-row">
            <i className="fa fa-area-chart fa-2x" />
            <div className="habla-title">{String.t('ckgPage.title')}</div>
          </div>
        </NewSubpageHeader>
        <TimeActivityGraph files={files.map(buildDataObject)} />
      </div>
    );
  }
}

CKGPage.propTypes = propTypes;
CKGPage.defaultProps = defaultProps;

export default CKGPage;
