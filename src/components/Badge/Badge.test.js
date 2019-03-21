import React from 'react';
import { render } from 'react-testing-library';
import Badge from './Badge';

test('does not render without counter', () => {
  const { container } = render(<Badge />);
  expect(container).toBeEmpty();
});

test('does not render with zero', () => {
  const { container } = render(<Badge count={0} />);
  expect(container).toBeEmpty();
});

test('renders the number', () => {
  const { container } = render(<Badge count={3} />);
  expect(container.firstChild).toHaveTextContent('3');
});

test('renders the limit number', () => {
  const { container } = render(<Badge count={120} />);
  expect(container.firstChild).toHaveTextContent('99+');
});
