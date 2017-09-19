import React from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import { IconCard } from '../../../components/cards';
import messages from '../messages';

const propTypes = {
  teamId: PropTypes.string.isRequired,
  teamRooms: PropTypes.array.isRequired,
  teamMembers: PropTypes.array.isRequired,
  onSwitchView: PropTypes.func.isRequired
};

function CardView(props) {
  const { teamRooms, teamMembers, onSwitchView } = props;
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

  return (
    <div>
      <SimpleHeader
        text={
          <div>
            <h2 className="simple-header__title simple-header__title--padding-right">
              {teamRooms.length === 0 ? 'No' : teamRooms.length} Team Rooms
              <span className="simple-header__icon-span simple-header__icon-span--padding-left">
                <a className="simple-header__icon-action simple-header__icon-action--black" title="Card View">
                  <i className="fa fa-th-large" />
                </a>
              </span>
              <span className="simple-header__icon-span">
                <a className="simple-header__icon-action" title="List View" onClick={onSwitchView}>
                  <i className="fa fa-align-justify" />
                </a>
              </span>
            </h2>
          </div>
        }
        type="node"
      />
      <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
        { renderAddCard(messages.addNewTeamRoom, `/app/createTeamRoom/${props.teamId}`) }
        { renderTeamRooms() }
      </SimpleCardContainer>
      <SimpleHeader text={`${teamMembers.length} Team Members`} />
      <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
        { renderAddCard(messages.inviteNewMember, `/`) }
        { renderTeamMembers() }
      </SimpleCardContainer>
    </div>
  );
}

CardView.propTypes = propTypes;

export default CardView;
