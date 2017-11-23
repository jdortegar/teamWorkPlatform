import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';

import TimeActivityGraph from '../../components/TimeActivityGraph';

const convertISODate = strISODate => moment(strISODate).format('YYYY/MM/DD HH:mm:ss');
const parseDateTime = strISODate => d3.timeParse('%Y/%m/%d %H:%M:%S')(convertISODate(strISODate));
const formatTime = (strISODate, format = '%H:%M:%S') => d3.timeFormat(format)(parseDateTime(strISODate));
const getColorByType = (type, fileTypes) => fileTypes.find(({ fileType }) => fileType === type).color;

const buildDataObject = (file, fileTypes) => ({
  ...file,
  date: parseDateTime(file.lastModified),
  time: moment.duration(formatTime(file.lastModified)).asHours(),
  displayTime: formatTime(file.lastModified, '%X'),
  color: getColorByType(file.fileType, fileTypes)
});

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
