import React from 'react';
import { render, fireEvent, wait } from 'react-testing-library';

import PreviewAttachments from './PreviewAttachments';

test('renders with no attachments', () => {
  const { container, queryByRole } = render(<PreviewAttachments />);
  expect(container).toBeEmpty();
  expect(container).not.toContainHTML('img');
  expect(queryByRole('dialog')).toBeNull();
});

test('renders image and opens modal on click', async () => {
  const { container, queryByAltText, queryByRole } = render(
    <PreviewAttachments
      attachments={[
        {
          type: 'image/png',
          meta: {
            fileName: 'file1.png',
            fileUrl: 'someurl.com/file1.png'
          }
        }
      ]}
    />
  );
  await wait(() => {
    const img = queryByAltText('file1.png');
    expect(img).toBeVisible();
    expect(container).toHaveTextContent('file1');
    expect(queryByRole('dialog')).toBeNull();

    fireEvent.click(img);
    expect(queryByRole('dialog')).toBeVisible();
    expect(queryByRole('dialog')).toContainHTML('img');
  });
});

test('renders pdf file and opens modal on click', async () => {
  const { queryByText, queryByRole } = render(
    <PreviewAttachments
      attachments={[
        {
          type: 'application/pdf',
          meta: {
            fileName: 'file2.pdf',
            fileUrl: 'someurl.com/file2.pdf'
          }
        }
      ]}
    />
  );
  await wait(() => {
    const div = queryByText('file2');
    expect(div).not.toBeNull();
    expect(queryByRole('dialog')).toBeNull();

    fireEvent.click(div);
    expect(queryByRole('dialog')).toBeVisible();
    expect(queryByRole('dialog')).toContainHTML('iframe');
  });
});

test('renders unknown file and does not open modal on click', async () => {
  const { queryByText, queryByRole } = render(
    <PreviewAttachments
      attachments={[
        {
          type: 'application/unknown',
          meta: {
            fileName: 'file3.unknown',
            fileUrl: 'someurl.com/file3.unknown'
          }
        }
      ]}
    />
  );
  await wait(() => {
    const div = queryByText('file3');
    expect(div).not.toBeNull();
    expect(queryByRole('dialog')).toBeNull();

    fireEvent.click(div);
    expect(queryByRole('dialog')).toBeNull();
  });
});
