import React, { Fragment } from 'react';
import { Tooltip, Collapse } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import String from 'src/translations';
import { integrationLabelFromKey, integrationImageFromKey } from 'src/utils/dataIntegrations';
import { SimpleCardContainer, SimpleHeader } from 'src/components';
import { AvatarWrapper, TeamAvatarWrapper } from 'src/containers';
import Avatar from 'src/components/common/Avatar';
import './styles/style.css';

const { Panel } = Collapse;

const propTypes = {
  integrations: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  subscribers: PropTypes.array.isRequired,
  subscribersPresences: PropTypes.object.isRequired,
  orgId: PropTypes.string.isRequired,
  teams: PropTypes.array.isRequired,
  teamMembersByTeamId: PropTypes.object.isRequired
};

function CardView(props) {
  const { integrations, subscribers, orgId, teams, user, subscribersPresences, teamMembersByTeamId } = props;
  const subscriberByMyUser = subscribers.find(subscriber => subscriber.userId === user.userId);

  const teamShouldRender = (isOrgAdmin, team) => {
    const role = subscriberByMyUser.teams[team.teamId];
    if (isOrgAdmin || team.active || (role && role.role === 'admin')) {
      /* role is undefined for default team (ALL) */
      return true;
    }
    return false;
  };

  const orgSubscribers = subscribers.map(subscriber => ({
    ...subscriber,
    online: _.some(_.values(subscribersPresences[subscriber.userId]), { presenceStatus: 'online' })
  }));

  const renderTeams = isOrgAdmin =>
    props.teams.map(team => {
      const teamRender = teamShouldRender(isOrgAdmin, team);
      if (teamRender) {
        const teamMembers = teamMembersByTeamId[team.teamId];
        const isMember = teamMembers && teamMembers.some(teamMemberId => teamMemberId === user.userId);

        return (
          <div key={team.teamId} className="mr-1 mb-2">
            {isMember ? (
              <Link to={`/app/team/${team.teamId}`}>
                <TeamAvatarWrapper team={team} size="large" />
                <div className="habla-label align-center-class card-label">{team.name}</div>
              </Link>
            ) : (
              <span>
                <TeamAvatarWrapper team={team} size="large" />
                <div className="habla-label align-center-class card-label">{team.name}</div>
              </span>
            )}
          </div>
        );
      }

      return null;
    });

  const renderMembers = () =>
    orgSubscribers.map(member => {
      const { userId, firstName } = member;
      return (
        <div key={userId} className="mr-1 mb-2">
          <Link to={`/app/teamMember/${userId}`}>
            <div>
              <AvatarWrapper size="large" user={member} hideStatusTooltip />
            </div>
            <div className="habla-label align-center-class card-label">{firstName}</div>
          </Link>
        </div>
      );
    });

  const renderIntegration = (key, integration) => {
    const label = integrationLabelFromKey(key);
    const desaturated = classNames({ desaturate: integration.expired });
    return (
      <div key={key} className="mr-1  mb-2 integration-card">
        <Tooltip placement="top" title={label}>
          <Link to={`/app/integrations/${orgId}/${key}`}>
            <Avatar size="large" src={integrationImageFromKey(key)} className={desaturated} />
            <i className="fa fa-check-circle icon_success habla-green" />
            <div className="habla-label align-center-class card-label">{label}</div>
          </Link>
        </Tooltip>
      </div>
    );
  };

  const renderIntegrations = () => {
    const integrationsArr = [];
    if (!_.isEmpty(integrations)) {
      Object.keys(integrations).forEach(key => {
        const integration = integrations[key];
        const { revoked } = integration;
        if (typeof revoked === 'undefined' || revoked === false) {
          integrationsArr.push(renderIntegration(key, integration));
        }
      });
    }

    return integrationsArr;
  };

  const renderAddCard = (title, url) => (
    <div className="mr-1 mb-2">
      <Tooltip placement="top" title={title}>
        <Link to={url}>
          <Avatar size="large">
            <i className="fa fa-plus" />
          </Avatar>
          <div className="habla-label align-center-class card-label">{String.t('OrganizationPage.newButtonLabel')}</div>
        </Link>
      </Tooltip>
    </div>
  );

  const integrationsArr = renderIntegrations();
  const isOrgAdmin = subscriberByMyUser.subscriberOrgs[orgId].role === 'admin';

  return (
    <Fragment>
      <Collapse defaultActiveKey={['1', '2', '3']} bordered={false}>
        <Panel
          header={
            <SimpleHeader text={String.t('OrganizationPage.integrationsHeader', { count: integrationsArr.length })} />
          }
          key="1"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex integration-list">
            {renderAddCard(String.t('OrganizationPage.addNewIntegration'), `/app/integrations/${orgId}`)}
            {integrationsArr}
          </SimpleCardContainer>
        </Panel>
        <Panel
          header={
            <SimpleHeader
              text={String.t('OrganizationPage.teamsHeader', {
                count: teams.filter(t => teamShouldRender(isOrgAdmin, t)).length
              })}
            />
          }
          key="2"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {renderAddCard(String.t('OrganizationPage.addNewTeam'), `/app/createTeam/${props.orgId}`)}
            {renderTeams(isOrgAdmin)}
          </SimpleCardContainer>
        </Panel>
        <Panel
          header={<SimpleHeader text={String.t('OrganizationPage.membersHeader', { count: orgSubscribers.length })} />}
          key="3"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {isOrgAdmin &&
              renderAddCard(String.t('OrganizationPage.addNewMember'), `/app/inviteNewMember/${props.orgId}`)}
            {renderMembers()}
          </SimpleCardContainer>
        </Panel>
      </Collapse>
    </Fragment>
  );
}

CardView.propTypes = propTypes;

export default CardView;
