import React from 'react';
import { Tooltip, Collapse } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import { IconCard } from '../../../components/cards';
import messages from '../messages';

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
    return teamRooms.map(({ name, teamRoomId }) => {
      return (
        <div key={teamRoomId}>
          <Tooltip placement="top" title={name}>
            <Link to={`/app/teamRoom/${teamRoomId}`}>
              <IconCard text={name} />
            </Link>
          </Tooltip>
        </div>
      );
    });
  };

  const renderTeamMembers = () => {
    return teamMembers.map(({ displayName, userId }) => {
      return (
        <div key={userId}>
          <Tooltip placement="top" title={displayName}>
            <a>
              <IconCard text={displayName} />
            </a>
          </Tooltip>
        </div>
      );
    });
  };

  const renderAddCard = (title, url = null) => {
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

  const userMember = teamMembers.filter(({ userId }) => { return userId === props.userId; })[0];
  const isTeamAdmin = (userMember.teams[props.teamId].role === 'admin');

  return (
    <div>
      <Collapse defaultActiveKey={['1', '2', '3']} bordered={false}>
        <Panel
          header={<SimpleHeader text={`Team Rooms (${teamRooms.length})`} />}
          key="1"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {isTeamAdmin && renderAddCard(messages.addNewTeamRoom, `/app/createTeamRoom/${props.teamId}`) }
            { renderTeamRooms() }
          </SimpleCardContainer>
        </Panel>
        <Panel
          header={<SimpleHeader text={`Team Members (${teamMembers.length})`} />}
          key="2"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {isTeamAdmin && renderAddCard(messages.inviteNewMember, `/app/inviteToTeam/${props.teamId}`) }
            { renderTeamMembers() }
          </SimpleCardContainer>
        </Panel>
      </Collapse>
    </div>
  );
}

CardView.propTypes = propTypes;

export default CardView;
