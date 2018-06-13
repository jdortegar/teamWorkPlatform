import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import {
  NewSubpageHeader,
  GraphViewSelector,
  LambWestonReports
} from 'components';
import String from 'translations';
import './styles/style.css';

const PLANTS = [
  { key: 'american falls', name: 'American Falls' },
  { key: 'boardman east', name: 'Boardman East' },
  { key: 'connell', name: 'Connell' },
  { key: 'delhi', name: 'Delhi' },
  { key: 'park rapids', name: 'Park Rapids' },
  { key: 'pasco', name: 'Pasco' },
  { key: 'richland', name: 'Richland' }
];

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);

    this.reportComponents = {
      plantUptime: {
        ReportComponent: LambWestonReports.PlantUptimeByLineAndString,
        fetchData: props.fetchPlantUptimeReport,
        showMenu: true
      },
      dailyPlantUptime: {
        ReportComponent: LambWestonReports.DailyPlantUptimeByLineAndString,
        fetchData: props.fetchDailyPlantUptimeReport,
        showMenu: true
      },
      plantUptimeMultiple: {
        ReportComponent: LambWestonReports.PlantUptimeMultiple,
        fetchData: props.fetchPlantUptimeMultipleReport
      },
      downtimeReasonsLevelOne: {
        ReportComponent: LambWestonReports.DowntimeAndReasonsLevelOne,
        fetchData: props.fetchDowntimeReasonsLevelOneReport,
        showMenu: true
      },
      downtimeComparisonMultiple: {
        ReportComponent: LambWestonReports.DowntimeComparisonMultiple,
        fetchData: props.fetchDowntimeComparisonMultipleReport
      }
    };
  }

  state = {
    plant: PLANTS[0]
  }

  handleSelectPlant = (key) => {
    const plant = PLANTS.find(item => item.key === key);
    this.setState({ plant });
  }

  renderSelectors = (reportId) => {
    const { showMenu } = this.reportComponents[reportId];
    if (!showMenu) return null;

    const menu = (
      <Menu
        selectable
        defaultSelectedKeys={[this.state.plant.key]}
        onClick={({ key }) => this.handleSelectPlant(key)}
      >
        <Menu.Item key="graphSelector">
          <div className="habla-label padding-class-a">{String.t('dashboardPage.labelSelectPlant')}</div>
        </Menu.Item>
        {PLANTS.map(plant => (
          <Menu.Item key={plant.key}>
            <a><span><i className="fas fa-industry" /> {plant.name}</span></a>
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div>
        <Dropdown
          overlay={menu}
          trigger={['click']}
          placement="bottomRight"
        >
          <a className="graphOptionsLink">
            <i className="fas fa-industry fa-2x" />
          </a>
        </Dropdown>
      </div>
    );
  }

  renderReport = (reportId) => {
    const { plant } = this.state;
    const { ReportComponent, fetchData } = this.reportComponents[reportId];
    if (!ReportComponent) return null;

    return (
      <div className="DashboardPage__reports">
        <ReportComponent
          {...this.props.selectedReport}
          fetchData={fetchData}
          plant={plant.key}
        />
      </div>
    );
  };

  renderReportsList() {
    return (
      <div className="DashboardPage__reports-list habla-color-blue">
        <div className="DashboardPage__reports-list-content">
          {Object.entries(this.props.reports).map(([key, value]) => (
            <div className="DashboardPage__report-item" key={key}>
              <div className="DashboardPage__report-item-content">
                <Link className="habla-label" to={`/app/dashboard/${key}`}>
                  <i className="far fa-chart-bar mr-1" />
                  {String.t(value.breadcrumb, { plant: String.t('dashboardPage.plant') })}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { currentSubscriberOrgId, selectedReport, reportId } = this.props;

    return (
      <div className="DashboardPage">
        <NewSubpageHeader>
          <div className="habla-main-content-header-title">
            <GraphViewSelector
              currentSubscriberOrgId={currentSubscriberOrgId}
            />
            <div className="flexClass breadcrumbLevels">
              <div className="habla-title-light responsiveHideClass">
                {String.t('dashboardPage.industryGraphsTitle')}
              </div>
              <i className="fas fa-angle-right responsiveHideClass" />
              {!selectedReport && (
                <div className="habla-title">
                  {String.t('dashboardPage.industryTitleManufacturing')}
                </div>
              )}
              {selectedReport && (
                <div className="flexClass">
                  <Link to={'/app/dashboard'} style={{ color: 'black' }}>
                    <div className="habla-title-light responsiveHideClass">
                      {String.t('dashboardPage.industryTitleManufacturing')}
                    </div>
                  </Link>
                  <i className="fas fa-angle-right responsiveHideClass" />
                  <div className="habla-title">
                    {String.t(selectedReport.breadcrumb, { plant: this.state.plant.name })}
                  </div>
                </div>
              )}
            </div>
            {selectedReport && this.renderSelectors(reportId)}
          </div>
        </NewSubpageHeader>

        {!selectedReport && this.renderReportsList()}
        {selectedReport && this.renderReport(reportId)}
      </div>
    );
  }
}

DashboardPage.propTypes = {
  currentSubscriberOrgId: PropTypes.string.isRequired,
  reports: PropTypes.object.isRequired,
  fetchPlantUptimeReport: PropTypes.func.isRequired,
  fetchDailyPlantUptimeReport: PropTypes.func.isRequired,
  fetchPlantUptimeMultipleReport: PropTypes.func.isRequired,
  fetchDowntimeReasonsLevelOneReport: PropTypes.func.isRequired,
  fetchDowntimeComparisonMultipleReport: PropTypes.func.isRequired,
  reportId: PropTypes.string,
  selectedReport: PropTypes.shape({
    breadcrumb: PropTypes.string.isRequired
  })
};

DashboardPage.defaultProps = {
  reportId: null,
  selectedReport: null
};

export default DashboardPage;
