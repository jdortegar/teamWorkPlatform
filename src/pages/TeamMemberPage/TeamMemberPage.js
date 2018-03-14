import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import AvatarWrapper from '../../components/common/Avatar/AvatarWrapper';
import Spinner from '../../components/Spinner';
import './styles/style.css';
import String from '../../translations';

const propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamMemberId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  subscribers: PropTypes.array.isRequired,
  subscribersPresences: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  subscriberOrg: PropTypes.object.isRequired
};

class TeamMemberPage extends Component {
  constructor(props) {
    super(props);

    this.state = { view: 'card' };
  }

  render() {
    const { subscriberOrg, subscribers, subscribersPresences, match } = this.props;
    if (!subscriberOrg || !subscribers || !subscribersPresences || !match || !match.params) {
      return <Spinner />;
    }

    const memberArray = subscribers.filter(m => m.userId === match.params.teamMemberId);
    if (memberArray.length < 1) {
      this.props.history.replace('/app');
      return null;
    }
    const member = {
      ...memberArray[0],
      online: _.some(_.values(subscribersPresences[memberArray[0].userId]), { presenceStatus: 'online' })
    };
    const { created, displayName, firstName, lastName, timeZone } = member;

    return (
      <div>
        <SubpageHeader
          subscriberOrgId={subscriberOrg.subscriberOrgId}
          history={this.props.history}
          breadcrumb={
            <BreadCrumb
              subscriberOrg={subscriberOrg}
              routes={[
                {
                  title: subscriberOrg.name,
                  link: `/app/organization/${subscriberOrg.subscriberOrgId}`
                },
                { title: String.t('teamMemberPage.breadcrumb') }
              ]}
            />
          }
        />
        <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
          <AvatarWrapper size="x-large" user={member} />
          <div className="margin-top-class-b">
            <h1 className="New-team__title habla-big-title habla-bold-text">
              {String.t('fullName', { firstName, lastName })}
            </h1>
            <div className="habla-secondary-paragraph">
              {String.t('teamMemberPage.displayName', { displayName })}
            </div>
            <div className="habla-secondary-paragraph">
              {String.t('teamMemberPage.timeZone', { timeZone })}
            </div>
            <div className="habla-secondary-paragraph">
              {String.t('teamMemberPage.memberSince', { date: moment(created).format('LL') })}
            </div>
          </div>
        </SimpleCardContainer>
      </div>
    );
  }
}

TeamMemberPage.propTypes = propTypes;

export default TeamMemberPage;
