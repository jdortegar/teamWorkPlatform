import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { IconCard } from '../../components/cards';
import './styles/style.css';

const propTypes = {
  integrations: PropTypes.array
};

const defaultProps = {
  integrations: [1, 2, 3, 4, 5, 6, 7, 8]
};

function OrganizationPage(props) {
  const renderAddCard = () => {
    return (
      <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
        <a>
          <IconCard icon={<i className="fa fa-plus simple-card__icons" aria-hidden="true" />} text="Add a New Integration" />
        </a>
      </Col>
    );
  };

  const renderIntegrations = props.integrations.map(() => {
    return (
      <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
        <a>
          <IconCard text="Name" />
        </a>
      </Col>
    );
  });

  return (
    <div>
      <SubpageHeader />
      <SimpleHeader text="Your Integrations (2)" />
      <SimpleCardContainer className="subpage-block">
        <Row type="flex" justify="start" gutter={20}>
          { renderAddCard() }
          { renderIntegrations }
        </Row>
      </SimpleCardContainer>
      <SimpleHeader text="Your Teams" />
    </div>
  );
}

OrganizationPage.propTypes = propTypes;
OrganizationPage.defaultProps = defaultProps;

export default OrganizationPage;
