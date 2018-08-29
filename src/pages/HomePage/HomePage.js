import React, { Component } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { hablaLogoAvatar } from '../../img';
import Spinner from '../../components/Spinner';
import CKGPage from '../../containers/CKGPage';
import String from '../../translations';
import Button from '../../components/common/Button';
import './styles/style.css';

class HomePage extends Component {
  state = {
    // TODO: This is temporary... we'll need an API to get activity
    activity: [
      {
        logo: hablaLogoAvatar,
        from: 'Habla AI Bot',
        text: `Welcome to Habla AI. <a href="/app/ckg/${
          this.props.currentSubscriberOrgId
        }>Click here</a> to start integrating data into your Knowledge Graph.`,
        created: null
      }
    ]
  };

  renderActivity() {
    // TODO: This is temporary... get and show the date that the subscriberOrg was created
    const { currentSubscriberOrgId, subscriberOrgById } = this.props;
    const org = subscriberOrgById[currentSubscriberOrgId];
    const date = moment(org.created).fromNow();

    return this.state.activity.map(({ logo, from }) => (
      <div key={date} className="homePage__activity-container margin-top-class-b">
        <div className="homePage__activity-item">
          <div className="homePage__activity-avatar">
            <img src={logo} alt={String.t('Header.logoAlt')} className="homePage__activity-avatar" />
          </div>
          <div className="homePage__activity-content-container">
            <div className="homePage__activity-content-header">{from}</div>
            <div className="homePage__activity-content-message">
              Welcome to Habla AI. To start using our tool as is best, please{' '}
              <a onClick={() => this.props.history.push(`/app/integrations/${this.props.currentSubscriberOrgId}`)}>
                {' '}
                add a data integration{' '}
              </a>
              to see your files on the time activity view on the CKG.{' '}
              <a onClick={() => this.props.history.push(`/app/organization/${this.props.currentSubscriberOrgId}`)}>
                 Invite people
              </a>
              {' '}
              to your teams and start new conversations. We hope that now you spend minutes finding the right data instead of searching folders for hours. The Habla Ai Team.
              <span className="homePage__activity-content-date"> ({date})</span>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  render() {
    const {
      fetchTimeActivitiesBySubscriberOrgId,
      setCurrentSubscriberOrgId,
      subscriberOrgById,
      currentSubscriberOrgId
    } = this.props;
    if (!subscriberOrgById || !subscriberOrgById[currentSubscriberOrgId]) {
      return <Spinner />;
    }
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

          <div className="hablaModalSurvey">
            <Modal
              visible={false}
              centered
              closable={false}
              footer={[
                <Button
                  key="submit"
                  type="main"
                  onClick={this.handleCancel}
                  className="habla-button align-center-class"
                >
                  Next (1 of 3)
                </Button>
              ]}
            >
              <div className="align-center-class">
                <div className="surveyHeeader padding-class-b">
                  <p className="habla-title">Welcome Thomas!</p>
                  <p className="habla-title-light">Please take a minute to help us improve.</p>
                </div>
                <div className="surveyContent padding-class-b habla-color-lightergrey">
                  <p className="habla-bold-text">
                    How many hours per week do you currently spend searching for and finding relevant files?
                  </p>
                  <div className="surveyAnswer mt-1">
                    <select>
                      <option value="0">Select one or more options:</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
        <div className="homepage_latest-container">{this.renderActivity()}</div>
      </div>
    );
  }
}

HomePage.propTypes = {
  history: PropTypes.object.isRequired,
  currentSubscriberOrgId: PropTypes.string.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  fetchTimeActivitiesBySubscriberOrgId: PropTypes.func.isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired
};

export default HomePage;
