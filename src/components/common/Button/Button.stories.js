import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Button from '.';

const types = ['main', 'secondary', 'alert', 'disable'];
const sizes = ['large', 'small', 'default'];

storiesOf('Button', module)
  .add('default', () => <Button onClick={action('clicked')}>Default Button</Button>)
  .add('with props', () => (
    <Button
      type={select('Type', types, 'secondary')}
      size={select('Size', sizes, 'default')}
      disabled={boolean('Disabled', false)}
      fitText={boolean('Fit text', false)}
      onClick={action('clicked')}
    >
      {text('Text', 'Button with props')}
    </Button>
  ))
  .add('with type main', () => (
    <Button type="main" onClick={action('clicked')}>
      Main Button
    </Button>
  ))
  .add('with type alert', () => (
    <Button type="alert" onClick={action('clicked')}>
      Alert Button
    </Button>
  ))
  .add('disabled', () => (
    <Button type="disable" disabled onClick={action('clicked')}>
      Disabled Button
    </Button>
  ));
