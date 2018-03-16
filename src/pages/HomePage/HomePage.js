import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hablaBlackLogoIcon } from '../../img';
import CKGPage from '../../containers/CKGPage';
import String from '../../translations';
import './styles/style.css';

class HomePage extends Component {
  state = {
    activity: [
      {
        logo: hablaBlackLogoIcon,
        from: 'Habla AI Inc.',
        text: (`Welcome to Habla AI. <a href="/app/ckg/${this.props.currentSubscriberOrgId}>Click here</a> to start integrating data into your Knowledge Graph.`)
      }
    ]
  }

  renderActivity() {
    return this.state.activity.map(({ logo, from }) => {
      return (
        <div className="homePage__activity-container">
          <div className="homePage__activity-avatar">
            <img src={logo} alt={String.t('Header.logoAlt')} className="homePage__activity-avatar" />
          </div>
          <div className="homePage__activity-content-container">
            <div className="homePage__activity-content-header">
              {from}
            </div>
            <div className="homePage__activity-content-message">
              Welcome to Habla AI.  <a onClick={() => this.props.history.push(`/app/integrations/${this.props.currentSubscriberOrgId}`)}> Click here
              </a> to start integrating data into your Knowledge Graph.
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    const { fetchTimeActivitiesBySubscriberOrgId, setCurrentSubscriberOrgId } = this.props;
    const subscriberOrgId = this.props.currentSubscriberOrgId;
    const params = { params: { subscriberOrgId } };
    return (
      <div className="homePage-main">
        <div className="homepage_graph-container">
          <CKGPage
            history={this.props.history}
            match={params}
            currentSubscriberOrgId={subscriberOrgId}
            fetchTimeActivitiesBySubscriberOrgId={fetchTimeActivitiesBySubscriberOrgId}
            setCurrentSubscriberOrgId={setCurrentSubscriberOrgId}
          />
        </div>
        <div className="homepage_latest-container">
          <div className="homepage_latest-header">{String.t('homePage.latestHeader')}</div>
          {this.renderActivity()}
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  history: PropTypes.object.isRequired,
  currentSubscriberOrgId: PropTypes.string.isRequired,
  fetchTimeActivitiesBySubscriberOrgId: PropTypes.func.isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired
};

export default HomePage;
