import React, { Fragment } from 'react';
import { Tooltip, Collapse } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import UserIcon from '../../../components/UserIcon';
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
  subscriberOrgId: PropTypes.string.isRequired,
  teams: PropTypes.array.isRequired
};

function CardView(props) {
  const { integrations, subscribers, subscriberOrgId, teams, user } = props;
  const subscriberByMyUser = subscribers.find(subscriber => subscriber.userId === user.userId);

  const teamShouldRender = (role, team) => {
    if (!role || (!team.active && role.role === 'admin') || team.active) {
      /* role is undefined for default team (ALL) */
      return true;
    }
    return false;
  };

  const renderTeams = () => {
    return props.teams.map((team) => {
      const role = subscriberByMyUser.teams[team.teamId];
      const teamRender = teamShouldRender(role, team);
      const initials = getInitials(team.name);
      if (teamRender) {
        return (
          <div key={team.teamId} className="px-1">
            <Tooltip placement="top" title={team.name}>
              {
                team.active ?
                  <Link to={`/app/team/${team.teamId}`}>
                    <Avatar size="large" color={team.preferences.iconColor}>{initials}</Avatar>
                  </Link> :
                  <Avatar size="large" color={team.preferences.iconColor}>{initials}</Avatar>
              }
            </Tooltip>
          </div>
        );
      }

      return null;
    });
  };

  const renderMembers = () => {
    return props.subscribers.map((member) => {
      const { userId, displayName } = member;
      return (
        <div key={userId} className="px-1">
          <Tooltip placement="top" title={displayName}>
            <Link to={`/app/teamMember/${userId}`}>
              <UserIcon
                user={member}
                type="user"
                minWidth="3.4em"
                width="3.4em"
                height="3.4em"
              />
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
            <div key="box" className="px-1">
              <Link to={`/app/integrations/${subscriberOrgId}/box`}>
                <Avatar size="large" src={boxLogo} className={desaturated} />
              </Link>
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
            <div key="google" className="px-1">
              <Link to={`/app/integrations/${subscriberOrgId}/google`}>
                <Avatar size="large" src={googleDriveLogo} className={desaturated} />
              </Link>
            </div>
          );
        }
      }
    }

    return integrationsArr;
  };

  const renderAddCard = (title, url) => {
    return (
      <div className="px-1">
        <Tooltip placement="top" title={title}>
          <Link to={url}>
            <Avatar size="large">
              <i className="fa fa-plus simple-card__icons" />
            </Avatar>
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
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
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
          header={<SimpleHeader text={String.t('OrganizationPage.membersHeader', { count: subscribers.length })} />}
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
