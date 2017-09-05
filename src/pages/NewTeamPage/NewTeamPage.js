import React, { Component } from 'react';
import { Row, Col } from 'antd';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { IconCard } from '../../components/cards';

class NewTeamPage extends Component {
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
            { renderProfileCard('Upload Avatar') }
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
      </div>
    );
  }
}

export default NewTeamPage;