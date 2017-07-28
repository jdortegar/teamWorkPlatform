import React from 'react';
import { Card, Icon } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  integrated: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  handleIntegration: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired
};

function IntegrationCard(props) {
  const { integrated, expired, name, img, handleIntegration, onRevoke } = props;

  const renderCard = () => {
    if (integrated && !expired) {
      return (<p>Integrated (<a onClick={onRevoke}>Revoke</a>)</p>);
    } else if (integrated && expired) {
      return (<a onClick={handleIntegration}>Reauthorize</a>);
    }

    return (<a onClick={handleIntegration}>Authorize</a>);
  };

  const renderIcon = () => {
    if (integrated && !expired) {
      return (<Icon type="close" style={{ color: '#f04134' }} />);
    } else if (integrated && expired) {
      return (<Icon type="check" style={{ color: '#00a854' }} />);
    }

    return '';
  };

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
          {renderIcon()}
        </div>
        <h3 style={{ paddingBottom: '4px' }}>{name}</h3>
        {renderCard()}
      </div>
    </Card>
  );
}

IntegrationCard.propTypes = propTypes;

export default IntegrationCard;
