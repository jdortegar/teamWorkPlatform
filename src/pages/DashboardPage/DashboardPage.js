import React from 'react';
import PropTypes from 'prop-types';

import { NewSubpageHeader, GraphViewSelector, LambWestonReports } from 'components';
import String from 'translations';

const DashboardPage = ({ currentSubscriberOrgId }) => (
  <div className="DashboardPage">
    <NewSubpageHeader>
      <div className="habla-main-content-header-title">
        <GraphViewSelector currentSubscriberOrgId={currentSubscriberOrgId} />
        <div>
          {String.t('dashboardPage.breadcrumb')}
        </div>
        <span className="breadcrumbs-separator">
          <i className="fas fa-angle-right" />
        </span>
        <div className="habla-title">
          {String.t('dashboardPage.dailyPlantUptimeBreadcrumb')}
        </div>
      </div>
    </NewSubpageHeader>

    <div>
      <LambWestonReports.ReportB />
    </div>
  </div>
);

DashboardPage.propTypes = {
  currentSubscriberOrgId: PropTypes.string.isRequired
};

export default DashboardPage;
