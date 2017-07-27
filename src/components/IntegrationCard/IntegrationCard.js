import React from 'react';
import { Card, Icon } from 'antd';
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

  const renderIcon = (integrated, expired) => {
    if(integrated && !expired) {
      return (<Icon type="close" style={{ color: '#f04134' }} />);
    } else if (integrated && expired) {
      return (<Icon type="check" style={{ color: '#00a854' }} />);
    }

    return '';
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
        <div style={{ textAlign: 'right', fontSize: '16px' }}>
          {renderIcon(integrated)}
        </div>
        <h3 style={{ paddingBottom: '4px' }}>{name}</h3>
        {renderCard(integrated, expired, handleIntegration)}
      </div>
    </Card>
  )
}

export default IntegrationCard;
