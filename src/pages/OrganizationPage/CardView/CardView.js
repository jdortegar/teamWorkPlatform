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
import { integrationLabelFromKey, integrationImageFromKey } from '../../../utils/dataIntegrations';
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

  const teamShouldRender = (isOrgAdmin, role, team) => {
    if (isOrgAdmin || (!role || (!team.active && role.role === 'admin') || team.active)) {
      /* role is undefined for default team (ALL) */
      return true;
    }
    return false;
  };

  const orgSubscribers = subscribers.map(subscriber => ({
    ...subscriber,
    online: _.some(_.values(subscribersPresences[subscriber.userId]), { presenceStatus: 'online' })
  }));

  const renderTeams = (isOrgAdmin) => {
    return props.teams.map((team) => {
      const role = subscriberByMyUser.teams[team.teamId];
      const teamRender = teamShouldRender(isOrgAdmin, role, team);
      const initials = getInitials(team.name);
      if (teamRender) {
        const className = classNames({ 'opacity-low': !team.active });
        return (
          <div key={team.teamId} className="mr-1">
            <Tooltip placement="top" title={team.name}>
              <Link to={`/app/team/${team.teamId}`}>
                {team.icon ?
                  <Avatar size="large" src={`data:image/jpeg;base64, ${team.icon}`} className={className} /> :
                  <Avatar size="large" color={team.preferences.iconColor} className={className}>{initials}</Avatar>
                }
              </Link>
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

  const renderIntegration = (key, integration) => {
    const label = integrationLabelFromKey(key);
    const { expired, revoked } = integration;
    const desaturated = classNames({
      desaturate: expired
    });

    if ((typeof revoked === 'undefined') || (revoked === false)) {
      return (
        <div key={key} className="mr-1 integration-card">
          <Tooltip placement="top" title={label}>
            <Link to={`/app/integrations/${subscriberOrgId}/${key}`}>
              <Avatar size="large" src={integrationImageFromKey(key)} className={desaturated} />
              <div className="habla-label align-center-class card-label">
                {label}
              </div>
            </Link>
          </Tooltip>
        </div>
      );
    }

    return null;
  };

  const renderIntegrations = () => {
    const integrationsArr = [];
    const subscriberIntegrations = integrations.integrationsBySubscriberOrgId[subscriberOrgId];
    if (!_.isEmpty(subscriberIntegrations)) {
      Object.keys(subscriberIntegrations).forEach((key) => {
        const integration = integrations.integrationsBySubscriberOrgId[subscriberOrgId];
        integrationsArr.push(renderIntegration(key, integration));
      });
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
            {renderTeams(isOrgAdmin)}
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
