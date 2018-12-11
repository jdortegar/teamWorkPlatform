import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, color, select, number } from '@storybook/addon-knobs';
import ProgressBar from '.';

const options = {
  range: true,
  min: 0,
  max: 100,
  step: 1
};

const types = ['line', 'circle', 'dashboard'];
const status = ['normal', 'success', 'exception', 'active'];

storiesOf('ProgressBar', module)
  .add('default', () => <ProgressBar percent={number('Progress', 0, options)} />)
  .add('with props', () => (
    <ProgressBar
      percent={number('Progress', 0, options)}
      strokeColor={color('Color', 'green')}
      type={select('Type', types, 'line')}
      status={select('Status', status, 'normal')}
      showInfo={boolean('Show Info', false)}
    />
  ));
