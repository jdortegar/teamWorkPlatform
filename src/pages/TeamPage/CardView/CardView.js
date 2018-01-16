import React from 'react';
import { Tooltip, Collapse } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../../../components/common/Avatar';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import { IconCard } from '../../../components/cards';
import UserIcon from '../../../components/UserIcon';
import String from '../../../translations';
import getInitials from '../../../utils/helpers';

const Panel = Collapse.Panel;

const propTypes = {
  userId: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  teamRooms: PropTypes.array.isRequired,
  teamMembers: PropTypes.array.isRequired
};

function CardView(props) {
  const { teamRooms, teamMembers } = props;
  const renderTeamRooms = () => {
    return teamRooms.map(({ active, name, teamRoomId, preferences }) => {
      const initials = getInitials(name);
      return (
        <div key={teamRoomId} className="px-1">
          <Tooltip placement="top" title={name}>
            {
              active ?
                <Link to={`/app/teamRoom/${teamRoomId}`}>
                  <Avatar size="large" color={preferences.iconColor}>{initials}</Avatar>
                </Link>
                :
                <Avatar size="large" color={preferences.iconColor}>{initials}</Avatar>
            }
          </Tooltip>
        </div>
      );
    });
  };

  const renderTeamMembers = () => {
    return teamMembers.map((member) => {
      return (
        <div key={member.userId} className="px-1">
          <Tooltip placement="top" title={member.displayName}>
            <a>
              <UserIcon
                user={member}
                type="member"
                minWidth="3.4em"
                width="3.4em"
                height="3.4em"
              />
            </a>
          </Tooltip>
        </div>
      );
    });
  };

  const renderAddCard = (title, url = null) => {
    return (
      <div className="px-1">
        <Tooltip placement="top" title={title}>
          <Link to={url}>
            <IconCard icon={<i className="fa fa-plus simple-card__icons" />} />
          </Link>
        </Tooltip>
      </div>
    );
  };

  const userMember = teamMembers.filter(({ userId }) => { return userId === props.userId; })[0];
  const isTeamAdmin = (userMember.teams[props.teamId].role === 'admin');
  const roomsSection = String.t('cardView.roomsHeader', { count: teamRooms.length });
  const membersSection = String.t('cardView.membersHeader', { count: teamMembers.length });

  return (
    <div>
      <Collapse defaultActiveKey={['1', '2', '3']} bordered={false}>
        <Panel
          header={<SimpleHeader text={roomsSection} />}
          key="1"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {isTeamAdmin && renderAddCard(String.t('cardView.addNewTeamRoom'), `/app/createTeamRoom/${props.teamId}`) }
            { renderTeamRooms() }
          </SimpleCardContainer>
        </Panel>
        <Panel
          header={<SimpleHeader text={membersSection} />}
          key="2"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {isTeamAdmin && renderAddCard(String.t('cardView.inviteNewMember'), `/app/inviteToTeam/${props.teamId}`) }
            { renderTeamMembers() }
          </SimpleCardContainer>
        </Panel>
      </Collapse>
    </div>
  );
}

CardView.propTypes = propTypes;

export default CardView;
