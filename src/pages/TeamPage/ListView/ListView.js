import React from 'react';
import PropTypes from 'prop-types';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import ListViewItem from '../../../components/ListViewItem/ListViewItem';
import messages from '../messages';

const propTypes = {
  teamRooms: PropTypes.array.isRequired,
  teamMembers: PropTypes.array.isRequired,
  onSwitchView: PropTypes.func.isRequired
};

function ListView(props) {
  const { teamRooms, teamMembers, onSwitchView } = props;
  const renderTeamRooms = () => {
    return teamRooms.map(({ name, teamRoomId }) => {
      return (
        <ListViewItem name={name} key={teamRoomId} onListItemClick={() => props.history.push(`/app/teamRoom/${teamRoomId}`)} />
      );
    });
  };

  const renderTeamMembers = () => {
    return teamMembers.map(({ displayName, userId }) => {
      return (
        <ListViewItem name={displayName} url={`/app/team/${userId}`} key={userId} />
      );
    });
  };

  return (
    <div>
      <SimpleHeader
        text={
          <div>
            <h2 className="simple-header__title simple-header__title--padding-right">
              {teamRooms.length === 0 ? 'No' : teamRooms.length} Team Rooms
              <span className="simple-header__icon-span simple-header__icon-span--padding-left">
                <a className="simple-header__icon-action" title="Card View" onClick={onSwitchView}>
                  <i className="fa fa-th-large" />
                </a>
              </span>
              <span className="simple-header__icon-span">
                <a className="simple-header__icon-action simple-header__icon-action--black" title="List View">
                  <i className="fa fa-align-justify" />
                </a>
              </span>
            </h2>
          </div>
        }
        type="node"
      />
      <SimpleCardContainer className="Simple-card--no-padding">
        <ListViewItem name={messages.addNewTeamRoom} />
        {renderTeamRooms()}
      </SimpleCardContainer>
      <SimpleHeader text={`${teamMembers.length} Members`} />
      <SimpleCardContainer className="Simple-card--no-padding">
        <ListViewItem name="Add New Team Member" />
        {renderTeamMembers()}
      </SimpleCardContainer>
    </div>
  );
}

ListView.propTypes = propTypes;

export default ListView;
