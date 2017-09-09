import React from 'react';
import { Col, Tooltip } from 'antd';
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
        <Col xs={{ span: 8 }} sm={{ span: 5 }} md={{ span: 4 }} lg={{ span: 3 }} key={teamId}>
          <Tooltip placement="top" title={name}>
            <Link to={`/app/team/${teamId}`}>
              <IconCard text={name} />
            </Link>
          </Tooltip>
        </Col>
      );
    });
  };

  const renderMembers = () => {
    return props.subscribers.map(({ displayName, userId }) => {
      return (
        <div>
          <Tooltip placement="top" title={displayName}>
            <Link to={`/app/teamMember/${userId}`}>
              <IconCard text={displayName} />
            </Link>
          </Tooltip>
        </div>
      );
    });
  };

  const renderIntegrations = () => {
    const integrationsArr = [];
    if (!_.isEmpty(integrations.integrationsBySubscriberOrgId[subscriberOrgId])) {
      if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].box) {
        let extra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
        if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].box.expired) {
          extra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
        }
        integrationsArr.push(
          <Col xs={{ span: 8 }} sm={{ span: 5 }} md={{ span: 4 }} lg={{ span: 3 }} key="box">
            <a>
              <IconCard text="Box" icon={extra} />
            </a>
          </Col>
        );
      }
      if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].google) {
        let extra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
        if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].google.expired) {
          extra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
        }
        integrationsArr.push(
          <Col xs={{ span: 8 }} sm={{ span: 5 }} md={{ span: 4 }} lg={{ span: 3 }} key="google">
            <a>
              <IconCard text="Google" extra={extra} />
            </a>
          </Col>
        );
      }
    }

    return integrationsArr;
  };

  const renderAddCard = (url) => {
    return (
      <div>
        <Link to={url}>
          <IconCard icon={<i className="fa fa-plus simple-card__icons" />} text={null} />
        </Link>
      </div>
    );
  };

  return (
    <div>
      <SimpleHeader
        text={
          <div>
            <h2 className="simple-header__title simple-header__title--padding-right">
              {integrations.length === 0 ? 'No' : integrations.length} Data Integrations
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
        {renderAddCard(`/app/integrations/${props.subscriberOrgId}`)}
        {renderIntegrations()}
      </SimpleCardContainer>
      <SimpleHeader text={`${teams.length} Team(s)`} search />
      <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
        { renderAddCard(`/app/createTeam/${props.subscriberOrgId}`) }
        {renderTeams()}
      </SimpleCardContainer>
      <SimpleHeader text={`${subscribers.length} Member(s)`} />
      <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
        { renderAddCard(() => console.log('hey')) }
        {renderMembers()}
      </SimpleCardContainer>
    </div>
  );
}

CardView.propTypes = propTypes;

export default CardView;
