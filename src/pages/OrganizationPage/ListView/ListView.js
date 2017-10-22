import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SimpleCardContainer from '../../../components/SimpleCardContainer';
import SimpleHeader from '../../../components/SimpleHeader';
import ListViewItem from '../../../components/ListViewItem/ListViewItem';

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

  const renderIntegrations = () => {
    const integrationsArr = [];

    debugger;
    if (!_.isEmpty(integrations.integrationsBySubscriberOrgId[subscriberOrgId])) {
      if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].box) {
        // let extra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
        // if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].box.expired) {
        //   extra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
        // }
        const { box: integrationObj } = integrations.integrationsBySubscriberOrgId[subscriberOrgId];
        const { expired, revoked } = integrationObj;
        if (((typeof expired === 'undefined') || (expired === false)) && ((typeof revoked === 'undefined') || (revoked === false))) {
          integrationsArr.push(
            <ListViewItem name="Box" key="box" />
          );
        }
      }
      if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].google) {
        // let extra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
        // if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].google.expired) {
        //   extra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
        // }
        const { google: integrationObj } = integrations.integrationsBySubscriberOrgId[subscriberOrgId];
        const { expired, revoked } = integrationObj;
        if (((typeof expired === 'undefined') || (expired === false)) && ((typeof revoked === 'undefined') || (revoked === false))) {
          integrationsArr.push(
            <ListViewItem name="Google" key="google" />
          );
        }
      }
    }

    return integrationsArr;
  };

  return (
    <div>
      <SimpleHeader
        text={
          <div>
            <h2 className="simple-header__title simple-header__title--padding-right">
              {integrations.length === 0 ? 'No' : integrations.length} Data Integrations
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
        <ListViewItem name="Add New Integration" />
        {renderIntegrations()}
      </SimpleCardContainer>
      <SimpleHeader text={`${teams.length} Members`} search />
      <SimpleCardContainer className="Simple-card--no-padding">
        <ListViewItem name="Add New Team" />
        {renderTeams()}
      </SimpleCardContainer>
      <SimpleHeader text={`${subscribers.length} Members`} />
      <SimpleCardContainer className="Simple-card--no-padding">
        <ListViewItem name="Add New Member" />
        {renderMembers()}
      </SimpleCardContainer>
    </div>
  );
}

ListView.propTypes = propTypes;

export default ListView;
