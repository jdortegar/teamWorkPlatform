import React from 'react';
import { render } from 'react-testing-library';

import ViewSelector from './ViewSelector';

test('renders default', () => {
  const { queryByTitle } = render(<ViewSelector onChange={() => {}} />);
  expect(queryByTitle('Chat Messages')).toBeInTheDocument();
  expect(queryByTitle('File Attachments')).toBeInTheDocument();
  expect(queryByTitle('Smart List View')).toBeInTheDocument();
  expect(queryByTitle('Time Activity Graph')).toBeInTheDocument();
});

test('ignores Messages', () => {
  const { queryByTitle } = render(<ViewSelector onChange={() => {}} ignoreMessages />);
  expect(queryByTitle('Chat Messages')).not.toBeInTheDocument();
  expect(queryByTitle('File Attachments')).toBeInTheDocument();
  expect(queryByTitle('Smart List View')).toBeInTheDocument();
  expect(queryByTitle('Time Activity Graph')).toBeInTheDocument();
});

test('sets active view', () => {
  render(<ViewSelector activeView="messagesView" onChange={() => {}} />);
  expect(document.querySelector('[checked=""]')).toHaveAttribute('value', 'messagesView');
});
