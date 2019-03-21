import getInitials from '../helpers';

test('gets the initials', () => {
  expect(getInitials('John')).toBe('J');
  expect(getInitials('John Doe')).toBe('JD');
  expect(getInitials('John C. Kennedy Doe')).toBe('JC');
});
