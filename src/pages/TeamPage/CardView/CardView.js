import React from 'react';
import { Tooltip, Collapse } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import classNames from 'classnames';
import Avatar from '../../../components/common/Avatar';
import AvatarWrapper from '../../../components/common/Avatar/AvatarWrapper';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import getInitials from '../../../utils/helpers';
import String from '../../../translations';

const Panel = Collapse.Panel;

const propTypes = {
  userId: PropTypes.string.isRequired,
  team: PropTypes.object.isRequired,
  teamRooms: PropTypes.array.isRequired,
  teamMembers: PropTypes.array.isRequired,
  teamMembersPresences: PropTypes.object.isRequired
};

function CardView(props) {
  const { team, teamRooms, teamMembers, teamMembersPresences } = props;

  const members = teamMembers.map(member => ({
    ...member,
    online: _.some(_.values(teamMembersPresences[member.userId]), { presenceStatus: 'online' })
  }));

  const userMember = members.filter(({ userId }) => { return userId === props.userId; })[0];
  const isAdmin = (userMember.teams[team.teamId].role === 'admin');

  const filteredRooms = teamRooms.filter(r => isAdmin || r.active);

  const renderTeamRooms = () => {
    return filteredRooms.map(({ name, teamRoomId, preferences, active }) => {
      const initials = getInitials(name);
      const className = classNames({ 'opacity-low': !active });
      return (
        <div key={teamRoomId} className="mr-1">
          <Tooltip placement="top" title={name}>
            <Link to={`/app/teamRoom/${teamRoomId}`}>
              <Avatar size="large" color={preferences.iconColor} className={className}>
                {initials}
              </Avatar>
              <div className="habla-label align-center-class card-label">
                {name}
              </div>
            </Link>
          </Tooltip>
        </div>
      );
    });
  };

  const renderTeamMembers = () => {
    return members.map((member) => {
      const { userId, firstName, lastName } = member;
      const fullName = String.t('fullName', { firstName, lastName });
      return (
        <div key={userId} className="mr-1">
          <Tooltip placement="top" title={fullName}>
            <Link to={`/app/teamMember/${userId}`}>
              <div>
                <AvatarWrapper size="large" user={member} hideStatusTooltip />
              </div>
              <div className="habla-label align-center-class card-label">
                {firstName}
              </div>
            </Link>
          </Tooltip>
        </div>
      );
    });
  };

  const renderAddCard = (title, url = null) => {
    return (
      <div className="mr-1">
        <Tooltip placement="top" title={title}>
          <Link to={url}>
            <Avatar size="large">
              <i className="fa fa-plus" />
            </Avatar>
            <div className="habla-label align-center-class card-label">
              {String.t('cardView.newButtonLabel')}
            </div>
          </Link>
        </Tooltip>
      </div>
    );
  };

  const roomsSection = String.t('cardView.roomsHeader', { count: filteredRooms.length });
  const membersSection = String.t('cardView.membersHeader', { count: members.length });

  return (
    <div>
      <Collapse defaultActiveKey={['1', '2', '3']} bordered={false}>
        <Panel
          header={<SimpleHeader text={roomsSection} />}
          key="1"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {isAdmin && team.active &&
              renderAddCard(String.t('cardView.addNewTeamRoom'), `/app/createTeamRoom/${team.teamId}`) }
            { renderTeamRooms(isAdmin) }
          </SimpleCardContainer>
        </Panel>
        <Panel
          header={<SimpleHeader text={membersSection} />}
          key="2"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {isAdmin && team.active &&
              renderAddCard(String.t('cardView.inviteNewMember'), `/app/inviteToTeam/${team.teamId}`) }
            { renderTeamMembers() }
          </SimpleCardContainer>
        </Panel>
      </Collapse>
    </div>
  );
}

CardView.propTypes = propTypes;

export default CardView;
