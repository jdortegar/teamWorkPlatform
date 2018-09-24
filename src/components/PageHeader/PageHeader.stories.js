import React from 'react';
import { storiesOf } from '@storybook/react';
import PageHeader from '.';

const menuPageHeader = [
  {
    icon: 'fas fa-pencil-alt',
    title: 'OrganizationPage.editSection',
    link: '/app/editOrganization/'
  }
];

storiesOf('PageHeader', module)
  .add('Default', () => <PageHeader pageNameLevelOne="OrganizationPage.title" hasMenu={false} />)
  .add('With title and subsection', () => (
    <PageHeader
      pageNameLevelOne="OrganizationPage.title"
      pageNameLevelTwo="OrganizationPage.title"
      hasMenu
      menuName="settings"
      menuPageHeader={menuPageHeader}
    />
  ))
  .add('With props', () => (
    <PageHeader pageNameLevelOne="OrganizationPage.title" hasMenu menuName="settings" menuPageHeader={menuPageHeader} />
  ));
