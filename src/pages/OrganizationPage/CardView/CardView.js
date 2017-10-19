import React from 'react';
import { Tooltip, Collapse } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import { IconCard } from '../../../components/cards';
import classNames from 'classnames';
import messages from '../messages';
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
    return props.teams.map(team => {
      const role = subscriberByMyUser.teams[team.teamId];
      const card = classNames({
        inactive: !team.active
      });
      const teamRender = teamShouldRender(role, team);
      if (teamRender) {
        return (
          <div key={team.teamId}>
            <Tooltip placement="top" title={team.name}>
              <Link to={`/app/team/${team.teamId}`}>
                <IconCard text={team.name} className={card} />
              </Link>
            </Tooltip>
          </div>
        );
      }
    });
  };

  const renderMembers = () => {
    return props.subscribers.map(({ displayName, userId }) => {
      return (
        <div key={userId}>
          <Tooltip placement="top" title={displayName}>
            <Link to={`/app/teamMember/${userId}`}>
              <IconCard text={displayName} />
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
          let extra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
          if (expired === true) {
            extra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
          }
          integrationsArr.push(
            <div key="box">
              <Link to={`/app/integrations/${subscriberOrgId}/box`}>
                <IconCard text="Box" icon={extra} />
              </Link>
            </div>
          );
        }
      }

      if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].google) {
        const { google: integrationObj } = integrations.integrationsBySubscriberOrgId[subscriberOrgId];
        const { expired, revoked } = integrationObj;

        if ((typeof revoked === 'undefined') || (revoked === false)) {
          let extra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
          if (expired === true) {
            extra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
          }
          integrationsArr.push(
            <div key="google">
              <Link to={`/app/integrations/${subscriberOrgId}/google`}>
                <IconCard text="Google" extra={extra} />
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
      <div>
        <Tooltip placement="top" title={title}>
          <Link to={url}>
            <IconCard icon={<i className="fa fa-plus simple-card__icons" />} />
          </Link>
        </Tooltip>
      </div>
    );
  };

  const integrationsArr = renderIntegrations();

  return (
    <div>
      <Collapse defaultActiveKey={['1', '2', '3']} bordered={false}>
        <Panel
          header={<SimpleHeader text={`Data Integrations (${integrationsArr.length})`} />}
          key="1"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {renderAddCard(<FormattedMessage {...messages.addNewIntegration} />, `/app/integrations/${props.subscriberOrgId}`)}
            {integrationsArr}
          </SimpleCardContainer>
        </Panel>
        <Panel
          header={<SimpleHeader text={`Teams (${teams.length})`} />}
          key="2"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            { renderAddCard(<FormattedMessage {...messages.addNewTeam} />, `/app/createTeam/${props.subscriberOrgId}`) }
            {renderTeams()}
          </SimpleCardContainer>
        </Panel>
        <Panel
          header={<SimpleHeader text={`Members (${subscribers.length})`} />}
          key="3"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            { renderAddCard(<FormattedMessage {...messages.addNewMember} />, `/app/inviteNewMember/${props.subscriberOrgId}`) }
            {renderMembers()}
          </SimpleCardContainer>
        </Panel>
      </Collapse>
    </div>
  );
}

CardView.propTypes = propTypes;

export default CardView;
