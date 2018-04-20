import React from 'react';

import { NewSubpageHeader, GraphViewSelector, LambWestonReports } from 'components';
import String from 'translations';

const DashboardPage = () => (
  <div className="DashboardPage">
    <NewSubpageHeader>
      <div className="habla-main-content-header-title">
        <GraphViewSelector />
        <div className="habla-title">{String.t('dashboardPage.title')}</div>
      </div>
    </NewSubpageHeader>

    <div>
      <LambWestonReports.ReportB />
    </div>
  </div>
);

export default DashboardPage;
