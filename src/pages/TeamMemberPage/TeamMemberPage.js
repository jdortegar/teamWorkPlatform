import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { IconCard } from '../../components/cards';
import CardView from './CardView';
import './styles/style.css';
import String from '../../translations';

const propTypes = {
  subscriberOrg: PropTypes.object.isRequired
};

class TeamMemberPage extends Component {
  constructor(props) {
    super(props);

    this.state = { view: 'card' };
  }

  render() {
    const renderProfileCard = (text) => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 8 }} md={{ span: 5 }}>
          <IconCard text={text} />
        </Col>
      );
    };
    const { subscriberOrg } = this.props;

    return (
      <div>
        <SubpageHeader
          breadcrumb={
            <BreadCrumb routes={[
              {
                title: subscriberOrg.name,
                link: `/app/organization/${subscriberOrg.subscriberOrgId}`
              },
              { title: String.t('teamMemberPage.breadcrumb') }
            ]}
            />
          }
        />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="start" gutter={20}>
            { renderProfileCard(String.t('teamMemberPage.profilePictureLabel')) }
            <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 19 }}>
              <div className="team-member-page__member-info">
                <h1>Gonzalo</h1>
                <p>john@example.com</p>
              </div>
              <div className="team-member-page__member-info">
                <h3 className="team-member-page__member-about">About Barry</h3>
              </div>
            </Col>
          </Row>
        </SimpleCardContainer>
        {
          this.state.view === 'card' ?
            <CardView /> : null
        }
      </div>
    );
  }
}

TeamMemberPage.propTypes = propTypes;

export default TeamMemberPage;
