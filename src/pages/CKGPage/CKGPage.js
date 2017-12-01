import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';
import String from '../../translations';

import TimeActivityGraph from '../../components/TimeActivityGraph';

const getFileType = (type, fileTypes) => fileTypes.find(({ fileType }) => fileType === type);
const parseDate = dateTime => d3.timeParse('%Y/%m/%d %H:%M:%S')(dateTime.format('YYYY/MM/DD HH:mm:ss'));
const buildTime = dateTime => moment().startOf('day').set({
  hour: dateTime.hour(),
  minute: dateTime.minutes(),
  second: dateTime.seconds()
});

const buildDataObject = (file, fileTypes) => {
  const dateTime = moment(file.lastModified);
  const { color, fileExtension } = getFileType(file.fileType, fileTypes);
  const extension = fileExtension || file.filename.split('.').pop();

  return {
    ...file,
    date: parseDate(dateTime),
    time: buildTime(dateTime),
    displayDate: moment(dateTime).format(String.t('timeActivityGraph.dateFormat')),
    displayTime: moment(dateTime).format(String.t('timeActivityGraph.timeFormat')),
    extension,
    color
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
    if (currentSubscriberOrgId) fetchTimeActivitiesBySubscriberOrgId(currentSubscriberOrgId);
  }

  render() {
    if (!this.props.timeActivities) return null;
    const { files, fileTypes } = this.props.timeActivities;
    return <TimeActivityGraph files={files.map(file => buildDataObject(file, fileTypes))} />;
  }
}

CKGPage.propTypes = propTypes;
CKGPage.defaultProps = defaultProps;

export default CKGPage;
