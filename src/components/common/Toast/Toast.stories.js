import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text, selectV2 } from '@storybook/addon-knobs/react';

import Toast from '.';

const types = ['success', 'info', 'warning', 'error'];
const positions = ['topRight', 'topLeft'];

storiesOf('Toast', module)
  .add('default', () => <Toast title="Toast title" />)
  .add('with description', () => (
    <Toast title="Toast title" description={text('Description', 'This is the description.')} />
  ))
  .add('with props', () => (
    <Toast
      title={text('Title', 'Toast title')}
      type={selectV2('Type', types, 'success')}
      position={selectV2('Position', positions, 'topRight')}
      showIcon={boolean('Show Icon', true)}
      description={text('Description', 'This is the description.')}
    />
  ));
