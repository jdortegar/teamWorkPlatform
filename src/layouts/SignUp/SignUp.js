import React from 'react';
import { Row, Col } from 'antd';
import './styles/signup.css';

function SignUp(props) {
  return (
    <div className="signup-main-div">
      <Row type="flex" justify="center" align="middle" style={{ width: '100%' }}>
        <Col xs={{ span: 20 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <img alt="Habla AI" className="signup-logo" src="https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png" />
            <h2>Habla AI</h2>
          </div>
          { props.children }
        </Col>
      </Row>
    </div>
  );
}

export default SignUp;
