import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';
import String from '../../translations';

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
  return {
    ...file,
    date: dateTime,
    time: buildTime(dateTime),
    color: color(file.fileExtension)
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
          <div className="habla-main-content-header-title">
            <i className="fas fa-chart-area fa-2x" />
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
