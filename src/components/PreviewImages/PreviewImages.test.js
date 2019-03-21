import React from 'react';
import mockAxios from 'axios';
import { render, fireEvent, wait } from 'react-testing-library';

import PreviewImages from './PreviewImages';

const URL = 'https://uw33cc3bz4.execute-api.us-west-2.amazonaws.com/dev/resource';
const headers = {
  headers: {
    Authorization: 'Bearer token1',
    'x-hablaai-subscriberorgid': 'org1',
    'x-hablaai-teamid': 'conversation1'
  }
};

test('renders with no images', () => {
  const { container, queryByRole } = render(<PreviewImages orgId="org1" token="token" />);
  expect(container).not.toBeEmpty();
  expect(container).not.toContainHTML('img');
  expect(queryByRole('dialog')).toBeNull();
});

test('renders image and opens modal on click', async () => {
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({
      headers: {
        'x-hablaai-content-type': 'image/png',
        'x-hablaai-filename': 'file1.png'
      },
      data: 'base64string'
    })
  );

  const { container, queryByAltText, queryByRole } = render(
    <PreviewImages
      orgId="org1"
      token="token1"
      conversationId="conversation1"
      images={[
        {
          resourceId: 'imageId',
          contentType: 'image/png'
        }
      ]}
    />
  );
  await wait(() => {
    const img = queryByAltText('file1.png');
    expect(img).toBeVisible();
    expect(container).toHaveTextContent('file1');
    expect(queryByRole('dialog')).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledWith(`${URL}/imageId`, headers);

    fireEvent.click(img);
    expect(queryByRole('dialog')).toBeVisible();
    expect(queryByRole('dialog')).toContainHTML('img');
  });
});

test('renders pdf file and opens modal on click', async () => {
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({
      headers: {
        'x-hablaai-content-type': 'application/pdf',
        'x-hablaai-filename': 'file2.pdf'
      },
      data: 'base64string'
    })
  );

  const { queryByText, queryByRole } = render(
    <PreviewImages
      orgId="org1"
      token="token1"
      conversationId="conversation1"
      images={[
        {
          resourceId: 'pdfId',
          contentType: 'application/pdf'
        }
      ]}
    />
  );
  await wait(() => {
    const div = queryByText('file2');
    expect(div).not.toBeNull();
    expect(queryByRole('dialog')).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledWith(`${URL}/pdfId`, headers);

    fireEvent.click(div);
    expect(queryByRole('dialog')).toBeVisible();
    expect(queryByRole('dialog')).toContainHTML('iframe');
  });
});

test('renders docx file and does not open modal on click', async () => {
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({
      headers: {
        'x-hablaai-content-type': 'application/docx',
        'x-hablaai-filename': 'file3.doc'
      },
      data: 'base64string'
    })
  );

  const { queryByText, queryByRole } = render(
    <PreviewImages
      orgId="org1"
      token="token1"
      conversationId="conversation1"
      images={[
        {
          resourceId: 'docxId',
          contentType: 'application/docx'
        }
      ]}
    />
  );
  await wait(() => {
    const div = queryByText('file3');
    expect(div).not.toBeNull();
    expect(queryByRole('dialog')).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledWith(`${URL}/docxId`, headers);

    fireEvent.click(div);
    expect(queryByRole('dialog')).toBeNull();
  });
});
