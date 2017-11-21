import React from 'react';
import PropTypes from 'prop-types';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import ListViewItem from '../../../components/ListViewItem/ListViewItem';
import String from '../../../translations';

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
              {String.t('TeamPage.roomsHeader', { count: teamRooms.length })}
              <span className="simple-header__icon-span simple-header__icon-span--padding-left">
                <a className="simple-header__icon-action" title={String.t('cardViewTitle')} onClick={onSwitchView}>
                  <i className="fa fa-th-large" />
                </a>
              </span>
              <span className="simple-header__icon-span">
                <a className="simple-header__icon-action simple-header__icon-action--black" title={String.t('listViewTitle')}>
                  <i className="fa fa-align-justify" />
                </a>
              </span>
            </h2>
          </div>
        }
        type="node"
      />
      <SimpleCardContainer className="Simple-card--no-padding">
        <ListViewItem name={String.t('TeamPage.addNewTeamRoom')} />
        {renderTeamRooms()}
      </SimpleCardContainer>
      <SimpleHeader text={String.t('TeamPage.membersHeader', { count: teamMembers.length })} />
      <SimpleCardContainer className="Simple-card--no-padding">
        <ListViewItem name={String.t('TeamPage.inviteNewMember')} />
        {renderTeamMembers()}
      </SimpleCardContainer>
    </div>
  );
}

ListView.propTypes = propTypes;

export default ListView;
