import React, { Component } from 'react';
import { Row, Col } from 'antd';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { IconCard } from '../../components/cards';

class TeamMemberPage extends Component {
  render() {
    const renderProfileCard = (text) => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
          <IconCard text={text} />
        </Col>
      );
    };

    return (
      <div>
        <SubpageHeader breadcrumb="Team Member" />
        <SimpleHeader text="Team Member Details" />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="start" gutter={20}>
            { renderProfileCard('Profile Picture') }
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
              <div>
                <h1>Gonzalo</h1>
                <h3>User role: <b>Administrator</b></h3>
              </div>
            </Col>
          </Row>
        </SimpleCardContainer>
      </div>
    );
  }
}

export default TeamMemberPage;
