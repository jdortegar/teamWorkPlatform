import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import ListViewItem from '../../../components/ListViewItem/ListViewItem';
import { integrationLabelFromKey } from '../../../utils/dataIntegrations';
import String from '../../../translations';

const propTypes = {
  integrations: PropTypes.object.isRequired,
  onSwitchView: PropTypes.func.isRequired,
  subscribers: PropTypes.array.isRequired,
  subscriberOrgId: PropTypes.string.isRequired,
  teams: PropTypes.array.isRequired
};

function ListView(props) {
  const { integrations, onSwitchView, subscribers, subscriberOrgId, teams } = props;
  const renderTeams = () => {
    return props.teams.map(({ name, teamId }) => {
      return (
        <ListViewItem name={name} key={teamId} onListItemClick={() => props.history.push(`/app/team/${teamId}`)} />
      );
    });
  };

  const renderMembers = () => {
    return props.subscribers.map(({ displayName, userId }) => {
      return (
        <ListViewItem name={displayName} onListItemClick={() => props.history.push(`/app/teamMember/${userId}`)} key={userId} />
      );
    });
  };

  const renderIntegration = (key, integration) => {
    const label = integrationLabelFromKey(key);
    const { expired, revoked } = integration;

    if (((typeof expired === 'undefined') || (expired === false)) && ((typeof revoked === 'undefined') || (revoked === false))) {
      return (
        <ListViewItem name={label} key={key} />
      );
    }

    return null;
  };

  const renderIntegrations = () => {
    const integrationsArr = [];
    const subscriberIntegrations = integrations.integrationsBySubscriberOrgId[subscriberOrgId];
    if (!_.isEmpty(subscriberIntegrations)) {
      Object.keys(subscriberIntegrations).forEach((key) => {
        const integration = integrations.integrationsBySubscriberOrgId[subscriberOrgId];
        integrationsArr.push(renderIntegration(key, integration));
      });
    }

    return integrationsArr;
  };

  return (
    <div>
      <SimpleHeader
        text={
          <div>
            <h2 className="simple-header__title simple-header__title--padding-right">
              {String.t('OrganizationPage.integrationsCount', { count: integrations.length })}
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
        <ListViewItem name={String.t('OrganizationPage.addNewIntegration')} />
        {renderIntegrations()}
      </SimpleCardContainer>
      <SimpleHeader text={`${teams.length} Members`} search />
      <SimpleCardContainer className="Simple-card--no-padding">
        <ListViewItem name={String.t('OrganizationPage.addNewTeam')} />
        {renderTeams()}
      </SimpleCardContainer>
      <SimpleHeader text={`${subscribers.length} Members`} />
      <SimpleCardContainer className="Simple-card--no-padding">
        <ListViewItem name={String.t('OrganizationPage.addNewMember')} />
        {renderMembers()}
      </SimpleCardContainer>
    </div>
  );
}

ListView.propTypes = propTypes;

export default ListView;
