import React from 'react';
import { Row, Col } from 'antd';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import SimpleCard from '../../SimpleCard';
import './styles/style.css';

function OrganizationPage(props) {
  const renderIntegrations = props.integrations.map(() => {
    return (
      <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
        <SimpleCard />
      </Col>
    );
  })

  return (
    <div>
      <SubpageHeader />
      <SimpleCardContainer className="subpage-block">
        <Row type="flex" justify="space-around" gutter={16}>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}><SimpleCard /></Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}><SimpleCard /></Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}><SimpleCard /></Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}><SimpleCard /></Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}><SimpleCard /></Col>
        </Row>
      </SimpleCardContainer>
    </div>
  );
}

export default OrganizationPage;
