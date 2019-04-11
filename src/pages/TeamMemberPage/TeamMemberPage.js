import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import String from 'src/translations';
import { PageHeader, SimpleCardContainer, Spinner } from 'src/components';
import { AvatarWrapper } from 'src/containers';
import CardView from './CardView';
import './styles/style.css';

const propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamMemberId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  subscribers: PropTypes.array.isRequired,
  subscribersPresences: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  subscriberOrg: PropTypes.object.isRequired,
  teams: PropTypes.object.isRequired
};

const TeamMemberPage = ({ subscriberOrg, subscribers, subscribersPresences, match, history, teams }) => {
  if (!subscriberOrg || !subscribers || !subscribersPresences || !match || !match.params) {
    return <Spinner />;
  }

  const memberArray = subscribers.filter(m => m.userId === match.params.teamMemberId);
  if (memberArray.length < 1) {
    history.replace('/app');
    return null;
  }
  const member = {
    ...memberArray[0],
    online: _.some(_.values(subscribersPresences[memberArray[0].userId]), { presenceStatus: 'online' })
  };
  const { userId, created, firstName, lastName, timeZone } = member;

  const memberTeamsArray = Object.keys(member.teams).map(key => teams[key]);

  // Breadcrumb
  const pageBreadCrumb = {
    routes: [
      {
        title: subscriberOrg.name,
        url: `/app/organization/${subscriberOrg.subscriberOrgId}`
      },
      {
        title: String.t('teamMemberPage.breadcrumb')
      }
    ]
  };

  return (
    <div>
      <PageHeader pageBreadCrumb={pageBreadCrumb} backButton />
      <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
        <AvatarWrapper size="x-large" user={member} />
        <div className="margin-top-class-b">
          <h1 className="New-team__title habla-user-title">{String.t('fullName', { firstName, lastName })}</h1>
          <div className="habla-secondary-paragraph">
            <a href={`mailto:${member.email}`} style={{ color: '#999' }}>
              {member.email}
            </a>
          </div>
          <div className="habla-secondary-paragraph">
            {String.t('teamMemberPage.memberSince', { date: moment(created).format('LL') })}
          </div>
          <div className="habla-secondary-paragraph">{String.t('teamMemberPage.timeZone', { timeZone })}</div>
        </div>
      </SimpleCardContainer>
      <div className="teamPage-list">
        <CardView userId={userId} teams={memberTeamsArray} />
      </div>
    </div>
  );
};

TeamMemberPage.propTypes = propTypes;

export default TeamMemberPage;
