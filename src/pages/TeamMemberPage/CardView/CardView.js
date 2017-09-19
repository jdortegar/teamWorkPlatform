import React from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import { IconCard } from '../../../components/cards';

const propTypes = {
  integrations: PropTypes.object.isRequired,
  onSwitchView: PropTypes.func.isRequired,
  subscribers: PropTypes.array.isRequired,
  subscriberOrgId: PropTypes.string.isRequired,
  teams: PropTypes.array.isRequired
};

function CardView(props) {
  const { integrations, onSwitchView, subscribers, subscriberOrgId, teams } = props;
  const renderTeams = () => {
    return props.teams.map(({ name, teamId }) => {
      return (
        <Col xs={{ span: 8 }} sm={{ span: 5 }} md={{ span: 4 }} key={teamId}>
          <Link to={`/app/team/${teamId}`}>
            <IconCard text={name} />
          </Link>
        </Col>
      );
    });
  };

  const renderTeamRooms = () => {
    return props.teams.map(({ name, teamId }) => {
      return (
        <Col xs={{ span: 8 }} sm={{ span: 5 }} md={{ span: 4 }} key={teamId}>
          <Link to={`/app/team/${teamId}`}>
            <IconCard text={name} />
          </Link>
        </Col>
      );
    });
  };

  const renderAddCard = (text, action) => {
    return (
      <Col xs={{ span: 8 }} sm={{ span: 5 }} md={{ span: 4 }}>
        <a onClick={action}>
          <IconCard icon={<i className="fa fa-plus simple-card__icons" />} text={text} />
        </a>
      </Col>
    );
  };

  return (
    <div>
      <SimpleHeader
        text={
          <div>
            <h2 className="simple-header__title simple-header__title--padding-right">
              Cool
              <span className="simple-header__icon-span simple-header__icon-span--padding-left">
                <a className="simple-header__icon-action simple-header__icon-action--black" title="Card View">
                  <i className="fa fa-th-large" />
                </a>
              </span>
              <span className="simple-header__icon-span">
                <a className="simple-header__icon-action" title="List View" onClick={() => console.log()}>
                  <i className="fa fa-align-justify" />
                </a>
              </span>
            </h2>
          </div>
        }
        type="node"
      />
      <SimpleCardContainer className="Simple-card--no-padding">
        Cool
      </SimpleCardContainer>
    </div>
  );
}

CardView.propTypes = propTypes;

export default CardView;
