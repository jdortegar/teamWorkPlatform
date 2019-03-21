import React from 'react';
import { render } from 'react-testing-library';
import BasicFilter from './BasicFilter';

test('renders', () => {
  const { container } = render(<BasicFilter tooltipTitle="John Doe" label="John Doe" />);
  expect(container).toHaveTextContent('John Doe');
});
