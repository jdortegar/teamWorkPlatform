import { availableIntegrationKeys, integrationLabelFromKey } from 'src/utils/dataIntegrations';

export default [
  {
    value: 'hours-spent',
    options: ['1', '2', '3', '4', '5', '6', '7', '8+']
  },
  {
    value: 'tools',
    options: availableIntegrationKeys().map(integrationLabelFromKey)
  },
  {
    value: 'preference',
    options: [
      'Closing the books faster',
      'Selling more in my job',
      'Taking care of higher priorities',
      'Developing more products',
      'Creating better products and GTM',
      'Surfing Huntington Beach Southside Pier or the Internet'
    ]
  }
];
