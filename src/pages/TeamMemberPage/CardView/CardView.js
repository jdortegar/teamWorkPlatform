import React from 'react';
import { Tooltip, Collapse } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import String from 'src/translations';
import getInitials from 'src/utils/helpers';
import { SimpleCardContainer, SimpleHeader } from 'src/components';
import Avatar from 'src/components/common/Avatar';

const { Panel } = Collapse;

const propTypes = {
  teams: PropTypes.array.isRequired
};

function CardView(props) {
  const { teams } = props;

  const renderTeams = () =>
    teams.map(team => {
      const initials = getInitials(team.name);
      const className = classNames({ 'opacity-low': !team.active });
      return (
        <div key={team.teamId} className="mr-1 mb-2">
          <Tooltip placement="top" title={team.name}>
            <Link to={`/app/team/${team.teamId}`}>
              {team.icon ? (
                <Avatar size="large" src={`data:image/jpeg;base64, ${team.icon}`} className={className} />
              ) : (
                <Avatar size="large" color={team.preferences.iconColor} className={className}>
                  {initials}
                </Avatar>
              )}
            </Link>
            <div className="habla-label align-center-class card-label">{team.name}</div>
          </Tooltip>
        </div>
      );
    });

  return (
    <div>
      <Collapse defaultActiveKey={['1', '2', '3']} bordered={false}>
        <Panel
          header={
            <SimpleHeader
              text={String.t('OrganizationPage.teamsHeader', {
                count: teams.length
              })}
            />
          }
          key="2"
        >
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
            {renderTeams(teams)}
          </SimpleCardContainer>
        </Panel>
      </Collapse>
    </div>
  );
}

CardView.propTypes = propTypes;

export default CardView;
