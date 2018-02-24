import React from 'react';
import { Tooltip, Collapse } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import classNames from 'classnames';
import Avatar from '../../../components/common/Avatar';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import getInitials from '../../../utils/helpers';
import String from '../../../translations';

const Panel = Collapse.Panel;

const propTypes = {
  userId: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  teamRooms: PropTypes.array.isRequired,
  teamMembers: PropTypes.array.isRequired,
  teamMembersPresences: PropTypes.object.isRequired
};

function CardView(props) {
  const { teamRooms, teamMembers, teamMembersPresences } = props;

  const members = teamMembers.map(member => ({
    ...member,
    online: _.some(_.values(teamMembersPresences[member.userId]), { presenceStatus: 'online' })
  }));

  const renderTeamRooms = () => {
    return teamRooms.map(({ name, teamRoomId, preferences }) => {
      const initials = getInitials(name);
      return (
        <div key={teamRoomId} className="mr-1">
          <Tooltip placement="top" title={name}>
            <Link to={`/app/teamRoom/${teamRoomId}`}>
              <Avatar size="large" color={preferences.iconColor}>
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
    return members.map(({ userId, firstName, lastName, preferences, icon, online }) => {
      const className = classNames({
        'mr-05': true,
        'opacity-low': !online
      });

      const fullName = String.t('fullName', { firstName, lastName });
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

  const userMember = members.filter(({ userId }) => { return userId === props.userId; })[0];
  const isTeamAdmin = (userMember.teams[props.teamId].role === 'admin');
  const roomsSection = String.t('cardView.roomsHeader', { count: teamRooms.length });
  const membersSection = String.t('cardView.membersHeader', { count: members.length });

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
