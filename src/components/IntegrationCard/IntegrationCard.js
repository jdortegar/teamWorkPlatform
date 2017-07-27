import React from 'react';
import { Card } from 'antd';
import './styles/style.css';

function IntegrationCard(props) {
  const { integrated, expired, name, img, handleIntegration } = props;

  const renderCard = (integrated, expired, handleIntegration) => {
    if(integrated && !expired) {
      return (<p>Integrated</p>);
    } else if(integrated && expired) {
      return (<a onClick={handleIntegration}>Reauthorize</a>);
    }

    return (<a onClick={handleIntegration}>Authorize</a>);
  }

  return (
    <Card style={{ width: 220 }} bodyStyle={{ padding: 0 }}>
      <div className="custom-image">
        {
          integrated && !expired ?
          <img alt={name} src={img} /> :
          <a onClick={handleIntegration}>
            <img alt={name} src={img} />
          </a>
        }
      </div>
      <div className="custom-card">
        <h3 style={{ paddingBottom: '8px' }}>{name}</h3>
        {renderCard(integrated, expired, handleIntegration)}
      </div>
    </Card>
  )
}

export default IntegrationCard;
