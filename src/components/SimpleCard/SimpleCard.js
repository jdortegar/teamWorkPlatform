import React from 'react';
import { Card } from 'antd';

function SimpleCard(props) {
  return (
    <Card>
      {props.children}
    </Card>
  );
}

export default SimpleCard;
