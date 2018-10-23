import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';

import String from 'src/translations';
import { PageHeader, LambWestonReports } from 'src/components';
import './styles/style.css';

const BASELINE_DATE = '2017-10-01';
const DATES = [...Array(8).keys()].map(i => {
  const date = moment(BASELINE_DATE).add(i, 'weeks');
  return {
    key: `week-${date.format('ww')}`,
    name: `Week from ${date.format('ll')}`,
    value: date
  };
});

const PLANTS = [
  { key: 'american falls', name: 'American Falls' },
  { key: 'boardman east', name: 'Boardman East' },
  { key: 'connell', name: 'Connell' },
  { key: 'delhi', name: 'Delhi' },
  { key: 'park rapids', name: 'Park Rapids' },
  { key: 'pasco', name: 'Pasco' },
  { key: 'richland', name: 'Richland' }
];

// Page Menu
const menuPageHeader = [
  {
    icon: 'fas fa-chart-area',
    title: 'graphViewsSelector.timeActivity',
    url: ''
  },
  // {
  //   icon: 'fas fa-bullseye',
  //   title: 'graphViewsSelector.teamMemberContribution',
  //   url: ''
  // },
  // {
  //   icon: 'fas fa-clone',
  //   title: 'graphViewsSelector.fileLineage',
  //   url: ''
  // },
  // {
  //   icon: 'fas fa-sitemap',
  //   title: 'graphViewsSelector.relationshipHeatMap',
  //   url: ''
  // },
  // {
  //   icon: 'fas fa-bars',
  //   title: 'graphViewsSelector.smartListView',
  //   url: ''
  // },
  // {
  //   icon: 'fas fa-stop',
  //   title: 'graphViewsSelector.customGraph',
  //   url: ''
  // },
  {
    icon: 'fas fa-chart-bar',
    title: 'graphViewsSelector.dashboard',
    url: '',
    submenu: [
      {
        title: 'graphViewsSelector.industryLabel',
        url: '',
        className: 'submenuTitle'
      },
      {
        icon: 'fas fa-chart-bar',
        title: 'graphViewsSelector.electronics',
        url: '#',
        className: 'disabled'
      },
      {
        icon: 'fas fa-chart-bar',
        title: 'graphViewsSelector.cpg',
        url: '#',
        className: 'disabled'
      },
      {
        icon: 'fas fa-chart-bar',
        title: 'graphViewsSelector.manufacturing',
        url: '/app/dashboard'
      },
      {
        icon: 'fas fa-chart-bar',
        title: 'graphViewsSelector.retail',
        url: '#',
        className: 'disabled'
      },
      {
        icon: 'fas fa-chart-bar',
        title: 'graphViewsSelector.relationshipHeatMap',
        url: '#',
        className: 'disabled'
      }
    ]
  }
];

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);

    this.reportComponents = {
      plantUptime: {
        ReportComponent: LambWestonReports.PlantUptimeByLineAndString,
        fetchData: props.fetchPlantUptimeReport,
        menuOptions: {
          plant: true,
          date: true
        }
      },
      dailyPlantUptime: {
        ReportComponent: LambWestonReports.DailyPlantUptimeByLineAndString,
        fetchData: props.fetchDailyPlantUptimeReport,
        menuOptions: {
          plant: true
        }
      },
      plantUptimeMultiple: {
        ReportComponent: LambWestonReports.PlantUptimeMultiple,
        fetchData: props.fetchPlantUptimeMultipleReport,
        menuOptions: {
          date: true
        }
      },
      downtimeReasonsLevelOne: {
        ReportComponent: LambWestonReports.DowntimeAndReasonsLevelOne,
        fetchData: props.fetchDowntimeReasonsLevelOneReport,
        menuOptions: {
          plant: true,
          date: true
        }
      },
      downtimeComparisonMultiple: {
        ReportComponent: LambWestonReports.DowntimeComparisonMultiple,
        fetchData: props.fetchDowntimeComparisonMultipleReport
      }
    };
  }

  state = {
    plant: PLANTS[0],
    date: DATES[0]
  };

  handleSelectDate = key => {
    const date = DATES.find(item => item.key === key);
    this.setState({ date });
  };

  handleSelectPlant = key => {
    const plant = PLANTS.find(item => item.key === key);
    this.setState({ plant });
  };

  renderDateSelector = () => {
    const menu = (
      <Menu selectable defaultSelectedKeys={[this.state.date.key]} onClick={({ key }) => this.handleSelectDate(key)}>
        <Menu.Item key="graphSelector">
          <div className="habla-label padding-class-a">{String.t('dashboardPage.labelSelectDate')}</div>
        </Menu.Item>
        {DATES.map(date => (
          <Menu.Item key={date.key}>
            <a>
              <span>
                <i className="fas fa-calendar-alt" /> {date.name}
              </span>
            </a>
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div>
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <a className="graphOptionsLink">
            <i className="fas fa-calendar-alt fa-2x" />
          </a>
        </Dropdown>
      </div>
    );
  };

  renderPlantSelector = () => {
    const menu = (
      <Menu selectable defaultSelectedKeys={[this.state.plant.key]} onClick={({ key }) => this.handleSelectPlant(key)}>
        <Menu.Item key="graphSelector">
          <div className="habla-label padding-class-a">{String.t('dashboardPage.labelSelectPlant')}</div>
        </Menu.Item>
        {PLANTS.map(plant => (
          <Menu.Item key={plant.key}>
            <a>
              <span>
                <i className="fas fa-industry" /> {plant.name}
              </span>
            </a>
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div>
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <a className="graphOptionsLink">
            <i className="fas fa-industry fa-2x" />
          </a>
        </Dropdown>
      </div>
    );
  };

  renderSelectors = reportId => {
    const { menuOptions } = this.reportComponents[reportId];
    if (!menuOptions) return null;

    return (
      <div style={{ display: 'flex' }}>
        {menuOptions.date && this.renderDateSelector()}
        {menuOptions.plant && this.renderPlantSelector()}
      </div>
    );
  };

  renderReport = reportId => {
    const { plant, date } = this.state;
    const { ReportComponent, fetchData, menuOptions } = this.reportComponents[reportId];
    if (!ReportComponent) return null;

    const dateProps = {};
    if (menuOptions && menuOptions.date) {
      dateProps.from = moment(date.value)
        .startOf('week')
        .format('YYYY-MM-DD');
      dateProps.until = moment(date.value)
        .endOf('week')
        .format('YYYY-MM-DD');
    }

    return (
      <div className="DashboardPage__reports">
        <ReportComponent {...this.props.selectedReport} fetchData={fetchData} plant={plant.key} {...dateProps} />
      </div>
    );
  };

  renderReportsList() {
    return (
      <div className="DashboardPage__reports-list habla-color-blue">
        <div className="DashboardPage__reports-list-content">
          {Object.entries(this.props.reports).map(([key, value]) => (
            <div className="DashboardPage__report-item" key={key}>
              <Link className="habla-label DashboardPage__report-item-content" to={`/app/dashboard/${key}`}>
                {String.t(value.breadcrumb, { plant: String.t('dashboardPage.plant') })}
                <div className="DashboardPage__report-item-minigraph" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { currentSubscriberOrgId, selectedReport, reportId } = this.props;

    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: String.t('ckgPage.title'),
          link: `/app/ckg/${currentSubscriberOrgId}`
        },
        {
          title: String.t('dashboardPage.industryTitleManufacturing'),
          link: '/app/dashboard'
        }
      ]
    };

    let optionalButtons = {};
    if (selectedReport) {
      const breadcrumbName = String.t(selectedReport.breadcrumb, { plant: this.state.plant.name });
      pageBreadCrumb.routes[2] = {
        title: breadcrumbName
      };
      optionalButtons = {
        enabled: true,
        content: this.renderSelectors(reportId)
      };
    }

    return (
      <div className="DashboardPage">
        <PageHeader
          pageBreadCrumb={pageBreadCrumb}
          hasMenu
          menuName="settings"
          menuPageHeader={menuPageHeader}
          backButton={selectedReport ? '/app/dashboard' : `/app/ckg/${currentSubscriberOrgId}`}
          optionalButtons={optionalButtons}
        />

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
