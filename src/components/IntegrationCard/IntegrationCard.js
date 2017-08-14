import React from 'react';
import { Card, Icon } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  integrated: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  handleIntegration: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired,
  expired: PropTypes.bool
};

const defaultProps = {
  expired: undefined
};

function IntegrationCard(props) {
  const { integrated, expired, name, img, handleIntegration, onRevoke } = props;

  const renderCard = () => {
    if (integrated && !expired) {
      return (<a onClick={onRevoke}>Revoke</a>);
    } else if (integrated && expired) {
      return (<p>Expired (<a onClick={handleIntegration}>Reauthorize)</a></p>);
    }

    return (<a onClick={handleIntegration}>Authorize</a>);
  };

  const renderIcon = () => {
    if (integrated && !expired) {
      return (
        <div className="img-status">
          <i className="fa fa-check-circle" style={{ color: '#00a854' }} aria-hidden="true" />
          <img alt={name} src={img} />
        </div>
      );
    } else if (integrated && expired) {
      return (
        <div className="img-status">
          <i className="fa fa-exclamation-triangle" style={{ color: '#f04134' }} aria-hidden="true" />
          <a onClick={handleIntegration}>
            <img className="desaturate" alt={name} src={img} />
          </a>
        </div>
      );
    }

    return (
      <div className="img-status">
        <a onClick={handleIntegration}>
          <img className="desaturate" alt={name} src={img} />
        </a>
      </div>
    );
  };

  return (
    <Card style={{ width: 220 }} bodyStyle={{ padding: 0 }}>
      <div className="custom-image">
        {renderIcon()}
      </div>
      <div className="custom-card">
        <h3 style={{ paddingBottom: '4px' }}>{name}</h3>
        {renderCard()}
      </div>
    </Card>
  );
}

IntegrationCard.propTypes = propTypes;
IntegrationCard.defaultProps = defaultProps;

export default IntegrationCard;
