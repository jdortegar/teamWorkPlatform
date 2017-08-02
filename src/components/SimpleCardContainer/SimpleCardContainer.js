import React from 'react';
import SimpleCard from '../SimpleCard';
import { Row, Col } from 'antd';

function SimpleCardContainer(props) {
  return (
    <div className={props.className}>
      <Row type="flex" justify="space-around" gutter={16}>
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}><SimpleCard /></Col>
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}><SimpleCard /></Col>
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}><SimpleCard /></Col>
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}><SimpleCard /></Col>
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}><SimpleCard /></Col>
      </Row>
    </div>
  );
}

export default SimpleCardContainer;
