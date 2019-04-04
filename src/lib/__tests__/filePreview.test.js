import { isPreviewSupported } from '../filePreview';

test('file is supported', () => {
  expect(isPreviewSupported('pdf')).toBeTruthy();
  // expect(isPreviewSupported('doc')).toBeTruthy();
  // expect(isPreviewSupported('xlsx')).toBeTruthy();
});

test('file is not supported', () => {
  expect(isPreviewSupported('')).toBeFalsy();
  expect(isPreviewSupported('xxx')).toBeFalsy();
  expect(isPreviewSupported('test')).toBeFalsy();
});
