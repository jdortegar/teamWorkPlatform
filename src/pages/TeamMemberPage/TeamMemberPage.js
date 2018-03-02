import React, { Component } from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import Avatar from '../../components/common/Avatar';
import Spinner from '../../components/Spinner';
import './styles/style.css';
import String from '../../translations';

const propTypes = {
  history: PropTypes.object.isRequired,
  subscriberOrg: PropTypes.object.isRequired
};

class TeamMemberPage extends Component {
  constructor(props) {
    super(props);

    this.state = { view: 'card' };
  }

  render() {
    const { subscriberOrg } = this.props;
    if (!subscriberOrg) {
      return <Spinner />;
    }

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
          <Avatar size="x-large" color="#cccccc">T</Avatar>
          <div className="margin-top-class-b">
            <h1 className="New-team__title habla-big-title habla-bold-text">
              Team Member Name
              <Tooltip placement="top" title={String.t('teamMemberPage.activeStatus')}>
                <div className="habla-main-content-item-signal habla-color-green" />
              </Tooltip>
            </h1>
            <div className="habla-secondary-paragraph">
              Member since November 27, 2017
            </div>
          </div>
        </SimpleCardContainer>
      </div>
    );
  }
}

TeamMemberPage.propTypes = propTypes;

export default TeamMemberPage;
