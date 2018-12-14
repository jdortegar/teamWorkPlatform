import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import { withKnobs } from '@storybook/addon-knobs';

import 'src/layouts/styles/reset.css';
import 'src/layouts/styles/habla-ui-styles.css';

addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(withKnobs);

const req = require.context('src/components', true, /\.stories\.js$/);
const loadStories = () => req.keys().forEach(filename => req(filename));

configure(loadStories, module);
