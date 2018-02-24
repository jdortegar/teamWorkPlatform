import React, { Fragment } from 'react';
import { Tooltip, Collapse } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import Avatar from '../../../components/common/Avatar';
import String from '../../../translations';
import getInitials from '../../../utils/helpers';
import { boxLogo, googleDriveLogo } from '../../../img';
import './styles/style.css';

const Panel = Collapse.Panel;

const propTypes = {
  integrations: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  subscribers: PropTypes.array.isRequired,
  subscribersPresences: PropTypes.object.isRequired,
  subscriberOrgId: PropTypes.string.isRequired,
  teams: PropTypes.array.isRequired
};

function CardView(props) {
  const { integrations, subscribers, subscriberOrgId, teams, user, subscribersPresences } = props;
  const subscriberByMyUser = subscribers.find(subscriber => subscriber.userId === user.userId);

  const teamShouldRender = (role, team) => {
    if (!role || (!team.active && role.role === 'admin') || team.active) {
      /* role is undefined for default team (ALL) */
      return true;
    }
    return false;
  };

  const orgSubscribers = subscribers.map(subscriber => ({
    ...subscriber,
    online: _.some(_.values(subscribersPresences[subscriber.userId]), { presenceStatus: 'online' })
  }));

  const renderTeams = () => {
    return props.teams.map((team) => {
      const role = subscriberByMyUser.teams[team.teamId];
      const teamRender = teamShouldRender(role, team);
      const initials = getInitials(team.name);
      if (teamRender) {
        return (
          <div key={team.teamId} className="mr-1">
            <Tooltip placement="top" title={team.name}>
              { team.active ?
                <Link to={`/app/team/${team.teamId}`}>
                  {team.icon ?
                    <Avatar size="large" src={`data:image/jpeg;base64, ${team.icon}`} /> :
                    <Avatar size="large" color={team.preferences.iconColor}>{initials}</Avatar>
                  }
                </Link> :
                <div>
                  {
                    team.icon ?
                      <Avatar size="large" src={`data:image/jpeg;base64, ${team.icon}`} /> :
                      <Avatar size="large" color={team.preferences.iconColor}>{initials}</Avatar>
                  }
                </div>
              }
              <div className="habla-label align-center-class card-label">
                {team.name}
              </div>
            </Tooltip>
          </div>
        );
      }

      return null;
    });
  };

  const renderMembers = () => {
    return orgSubscribers.map((member) => {
      const { userId, firstName, lastName, preferences, icon, online } = member;
      const fullName = String.t('fullName', { firstName, lastName });
      const className = classNames({
        'mr-05': true,
        'opacity-low': !online
      });
      return (
        <div key={userId} className="mr-1">
          <Tooltip placement="top" title={fullName}>
            <Link to={`/app/teamMember/${userId}`}>
              {
                icon ?
                  <Avatar size="large" src={`data:image/jpeg;base64, ${icon}`} className={className} /> :
                  <Avatar size="large" color={preferences.iconColor} className={className}>
                    {getInitials(fullName)}
                  </Avatar>
              }
              <div className="habla-label align-center-class card-label">
                {firstName}
              </div>
            </Link>
          </Tooltip>
        </div>
      );
    });
  };

  const renderIntegrations = () => {
    const integrationsArr = [];
    if (!_.isEmpty(integrations.integrationsBySubscriberOrgId[subscriberOrgId])) {
      if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].box) {
        const { box: integrationObj } = integrations.integrationsBySubscriberOrgId[subscriberOrgId];
        const { expired, revoked } = integrationObj;

        if ((typeof revoked === 'undefined') || (revoked === false)) {
          const desaturated = classNames({
            desaturate: expired
          });

          integrationsArr.push(
            <div key="box" className="mr-1 integration-card">
              <Tooltip placement="top" title={String.t('OrganizationPage.boxIntegrationLabel')}>
                <Link to={`/app/integrations/${subscriberOrgId}/box`}>
                  <Avatar size="large" src={boxLogo} className={desaturated} />
                  <div className="habla-label align-center-class card-label">
                    {String.t('OrganizationPage.boxIntegrationLabel')}
                  </div>
                </Link>
              </Tooltip>
            </div>
          );
        }
      }

      if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].google) {
        const { google: integrationObj } = integrations.integrationsBySubscriberOrgId[subscriberOrgId];
        const { expired, revoked } = integrationObj;
        const desaturated = classNames({
          desaturate: expired
        });

        if ((typeof revoked === 'undefined') || (revoked === false)) {
          integrationsArr.push(
            <div key="google" className="mr-1 integration-card">
              <Tooltip placement="top" title={String.t('OrganizationPage.gdriveIntegrationLabel')}>
                <Link to={`/app/integrations/${subscriberOrgId}/google`}>
                  <Avatar size="large" src={googleDriveLogo} className={desaturated} />
                  <div className="habla-label align-center-class card-label">
                    {String.t('OrganizationPage.gdriveIntegrationLabel')}
                  </div>
                </Link>
              </Tooltip>
            </div>
          );
        }
      }
    }

    return integrationsArr;
  };

  const renderAddCard = (title, url) => {
    return (
      <div className="mr-1">
        <Tooltip placement="top" title={title}>
          <Link to={url}>
            <Avatar size="large">
              <i className="fa fa-plus" />
            </Avatar>
            <div className="habla-label align-center-class card-label">
              {String.t('OrganizationPage.newButtonLabel')}
            </div>
          </Link>
        </Tooltip>
      </div>
    );
  };

  const integrationsArr = renderIntegrations();
  const isOrgAdmin = (subscriberByMyUser.subscriberOrgs[subscriberOrgId].role === 'admin');

  return (
    <Fragment>
      <Collapse defaultActiveKey={['1', '2', '3']} bordered={false}>
        <Panel
          header={<SimpleHeader text={String.t('OrganizationPage.integrationsHeader', { count: integrationsArr.length })} />}
          key="1"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex integration-list">
            {renderAddCard(String.t('OrganizationPage.addNewIntegration'), `/app/integrations/${subscriberOrgId}`)}
            {integrationsArr}
          </SimpleCardContainer>
        </Panel>
        <Panel
          header={<SimpleHeader text={String.t('OrganizationPage.teamsHeader', { count: teams.length })} />}
          key="2"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {isOrgAdmin && renderAddCard(String.t('OrganizationPage.addNewTeam'), `/app/createTeam/${props.subscriberOrgId}`) }
            {renderTeams()}
          </SimpleCardContainer>
        </Panel>
        <Panel
          header={<SimpleHeader text={String.t('OrganizationPage.membersHeader', { count: orgSubscribers.length })} />}
          key="3"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {isOrgAdmin && renderAddCard(String.t('OrganizationPage.addNewMember'), `/app/inviteNewMember/${props.subscriberOrgId}`) }
            {renderMembers()}
          </SimpleCardContainer>
        </Panel>
      </Collapse>
    </Fragment>
  );
}

CardView.propTypes = propTypes;

export default CardView;
