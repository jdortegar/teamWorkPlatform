import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs/react';

import SurveyModal from '.';

storiesOf('SurveyModal', module)
  .add('first survey', () => (
    <SurveyModal visible userName="John Doe" submitSurvey={action('submitted')} isFirstSurvey />
  ))
  .add('recurrent survey', () => (
    <SurveyModal visible userName="John Doe" submitSurvey={action('submitted')} isFirstSurvey={false} />
  ))
  .add('with props', () => (
    <SurveyModal
      visible={boolean('Visible', true)}
      isFirstSurvey={boolean('Is first survey?', true)}
      userName={text('User name', 'John Doe')}
      submitSurvey={action('submitted')}
    />
  ));
