import React, { Component } from 'react';
import { Row, Col } from 'antd';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { IconCard } from '../../components/cards';
import CardView from './CardView';
import './styles/style.css';

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

    return (
      <div>
        <SubpageHeader breadcrumb="Team Member" />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="start" gutter={20}>
            { renderProfileCard('Profile Picture') }
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

export default TeamMemberPage;
