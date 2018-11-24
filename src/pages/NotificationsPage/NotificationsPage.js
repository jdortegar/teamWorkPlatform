import React, { Component } from 'react';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { NewSubpageHeader } from 'src/components';
import moment from 'moment';
import { hablaLogoAvatar } from 'src/img';
import './styles/style.css';

const propTypes = {
  history: PropTypes.object.isRequired,
  org: PropTypes.object.isRequired
};

// eslint-disable-next-line react/prefer-stateless-function
class NotificationsPage extends Component {
  render() {
    const { history, org } = this.props;

    return (
      <div>
        <NewSubpageHeader>
          <div className="habla-main-content-header-title">
            <div className="actionButtonsContainer">
              <a>
                <svg className="fas fa-bars fa-w-14 fa-2x" />
                <i className="fas fa-chevron-down" />
              </a>
            </div>
            <div className="habla-title">{String.t('notificationPage.title')}</div>
          </div>
        </NewSubpageHeader>
        <div className="notification-body">
          <div className="homePage__activity-container margin-top-class-b">
            <div className="homePage__activity-item">
              <div className="homePage__activity-avatar">
                <img src={hablaLogoAvatar} alt={String.t('Header.logoAlt')} className="homePage__activity-avatar" />
              </div>
              <div className="homePage__activity-content-container">
                <div className="homePage__activity-content-header">Habla AI Bot</div>
                <div className="homePage__activity-content-message">
                  Welcome to Habla AI. To start using our tool as is best, please{' '}
                  <a onClick={() => history.push(`/app/integrations/${org.subscriberOrgId}`)}>
                    {' '}
                    add a data integration{' '}
                  </a>
                  to see your files on the time activity view on the CKG.{' '}
                  <a onClick={() => history.push(`/app/organization/${org.subscriberOrgId}`)}>Invite people</a> to your
                  teams and start new conversations. We hope that now you spend minutes finding the right data instead
                  of searching folders for hours. The Habla Ai Team.
                  <span className="homePage__activity-content-date"> ({moment(org.created).fromNow()})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NotificationsPage.propTypes = propTypes;

export default NotificationsPage;
