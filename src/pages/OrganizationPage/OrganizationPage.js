import React from 'react';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import './styles/style.css';

function OrganizationPage() {
  return (
    <div>
      <SubpageHeader />
      <SimpleCardContainer className="subpage-block" />
    </div>
  );
}

export default OrganizationPage;
