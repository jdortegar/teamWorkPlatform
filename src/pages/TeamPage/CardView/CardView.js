import React from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import { IconCard } from '../../../components/cards';

const propTypes = {
  teamRooms: PropTypes.array.isRequired,
  teamMembers: PropTypes.array.isRequired,
  onSwitchView: PropTypes.func.isRequired
};

function CardView(props) {
  const { teamRooms, teamMembers, onSwitchView } = props;
  const renderTeamRooms = () => {
    return teamRooms.map(({ name, teamRoomId }) => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }} key={teamRoomId}>
          <Link to={`/app/teamRoom/${teamRoomId}`}>
            <IconCard text={name} />
          </Link>
        </Col>
      );
    });
  }

  const renderTeamMembers = () => {
    return teamMembers.map(({ displayName, userId }) => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }} key={userId}>
          <a>
            <IconCard text={displayName} />
          </a>
        </Col>
      );
    });
  }

  const renderAddCard = (text, url = null) => {
    return (
      <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
        <Link to={url}>
          <IconCard icon={<i className="fa fa-plus simple-card__icons" />} text={text} />
        </Link>
      </Col>
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
      <SimpleCardContainer className="subpage-block">
        <Row type="flex" justify="start" gutter={20}>
          { renderAddCard('Add a New Team Room', `/`) }
          { renderTeamRooms() }
        </Row>
      </SimpleCardContainer>
      <SimpleHeader text={`${teamMembers.length} Team Members`} />
      <SimpleCardContainer className="subpage-block">
        <Row type="flex" justify="start" gutter={20}>
          { renderAddCard('Invite a New Team Member', `/`) }
          { renderTeamMembers() }
        </Row>
      </SimpleCardContainer>
    </div>
  );
}

CardView.propTypes = propTypes;

export default CardView;
