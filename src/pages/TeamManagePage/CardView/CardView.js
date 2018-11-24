import React from 'react';
import { Tooltip, Collapse } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import classNames from 'classnames';

import String from 'src/translations';
import { AvatarWrapper, SimpleCardContainer, SimpleHeader } from 'src/components';
import { integrationLabelFromKey, integrationImageFromKey } from 'src/utils/dataIntegrations';
import Avatar from 'src/components/common/Avatar';

const { Panel } = Collapse;

const propTypes = {
  userId: PropTypes.string.isRequired,
  team: PropTypes.object.isRequired,
  teamMembers: PropTypes.array.isRequired,
  presences: PropTypes.object.isRequired,
  integrations: PropTypes.array.isRequired,
  users: PropTypes.object.isRequired
};

const CardView = props => {
  const { team, teamMembers, presences, integrations, users } = props;

  // Get members data form Users
  const members = teamMembers.map(memberId => {
    const member = users[memberId];
    return {
      ...member,
      online: _.some(_.values(presences[member.userId]), { presenceStatus: 'online' })
    };
  });
  const userMember = members.filter(({ userId }) => userId === props.userId)[0];
  const isAdmin = userMember.teams[team.teamId].role === 'admin';

  const renderTeamMembers = () =>
    members.map(member => {
      const { userId, firstName, lastName } = member;
      const fullName = String.t('fullName', { firstName, lastName });
      return (
        <div key={userId} className="mr-1 mb-2">
          <Tooltip placement="top" title={fullName}>
            <Link to={`/app/teamMember/${userId}`}>
              <div>
                <AvatarWrapper size="large" user={member} hideStatusTooltip />
              </div>
              <div className="habla-label align-center-class card-label">{firstName}</div>
            </Link>
          </Tooltip>
        </div>
      );
    });

  const renderAddCard = (title, url = null) => (
    <div className="mr-1 mb-2">
      <Tooltip placement="top" title={title}>
        <Link to={url}>
          <Avatar size="large">
            <i className="fa fa-plus" />
          </Avatar>
          <div className="habla-label align-center-class card-label">{String.t('cardView.newButtonLabel')}</div>
        </Link>
      </Tooltip>
    </div>
  );

  const membersSection = String.t('cardView.membersHeader', { count: members.length });

  const renderIntegration = integration => {
    const { source } = integration;
    const label = integrationLabelFromKey(source);
    const desaturated = classNames({ desaturate: integration.expired });
    const integrationUser = members.find(member => member.userId === integration.userId);

    return (
      <div key={`${source}_${integrationUser.firstName}`} className="mr-1  mb-2 integration-card">
        <Tooltip placement="top" title={`${label} - ${integrationUser.firstName}`}>
          <Link to={`/app/teamIntegrations/${team.teamId}/${source}`}>
            <Avatar size="large" src={integrationImageFromKey(source)} className={desaturated} />
            <i className="fa fa-check-circle icon_success habla-green" />
            <div className="habla-label align-center-class card-label">
              {integrationUser.firstName || integrationUser.email}
            </div>
          </Link>
        </Tooltip>
      </div>
    );
  };

  return (
    <div>
      <Collapse defaultActiveKey={['1', '2', '3']} bordered={false}>
        <Panel
          header={<SimpleHeader text={String.t('TeamPage.integrationsHeader', { count: integrations.length })} />}
          key="1"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex integration-list">
            {renderAddCard(String.t('TeamPage.addNewIntegration'), `/app/teamIntegrations/${team.teamId}`)}
            {integrations.map(renderIntegration)}
          </SimpleCardContainer>
        </Panel>
        <Panel header={<SimpleHeader text={membersSection} />} key="2">
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {isAdmin &&
              team.active &&
              renderAddCard(String.t('cardView.inviteNewMember'), `/app/inviteToTeam/${team.teamId}`)}
            {renderTeamMembers()}
          </SimpleCardContainer>
        </Panel>
      </Collapse>
    </div>
  );
};

CardView.propTypes = propTypes;

export default CardView;
