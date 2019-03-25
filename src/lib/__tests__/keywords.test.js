import { extractKeywords } from '../keywords';

test('extract keywords', () => {
  expect(extractKeywords()).toEqual([]);
  expect(extractKeywords('Habla')).toEqual(['Habla']);
  expect(extractKeywords('Habla AI')).toEqual(['Habla', 'AI']);
  expect(extractKeywords('Habla,AI,Design')).toEqual(['Habla', 'AI', 'Design']);
  expect(extractKeywords('Habla AI,Design')).toEqual(['Habla', 'AI', 'Design']);
  expect(extractKeywords('Habla AI - Design')).toEqual(['Habla', 'AI', '-', 'Design']);
});

test('limits the keywords', () => {
  expect(extractKeywords('one', 2)).toEqual(['one']);
  expect(extractKeywords('one two', 2)).toEqual(['one', 'two']);
  expect(extractKeywords('one two three', 2)).toEqual(['one', 'two']);
});
