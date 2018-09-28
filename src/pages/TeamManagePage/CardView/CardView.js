import React from 'react';
import { Tooltip, Collapse } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import String from 'src/translations';
import { AvatarWrapper, SimpleCardContainer, SimpleHeader } from 'src/components';
import Avatar from 'src/components/common/Avatar';

const { Panel } = Collapse;

const propTypes = {
  userId: PropTypes.string.isRequired,
  team: PropTypes.object.isRequired,
  teamMembers: PropTypes.array.isRequired,
  teamMembersPresences: PropTypes.object.isRequired
};

function CardView(props) {
  const { team, teamMembers, teamMembersPresences } = props;

  const members = teamMembers.map(member => ({
    ...member,
    online: _.some(_.values(teamMembersPresences[member.userId]), { presenceStatus: 'online' })
  }));

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

  return (
    <div>
      <Collapse defaultActiveKey={['1', '2', '3']} bordered={false}>
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
}

CardView.propTypes = propTypes;

export default CardView;
