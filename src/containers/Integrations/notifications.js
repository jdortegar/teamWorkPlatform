function selectProvider(integration) {
  if(integration === 'google') {
    return 'Google Drive';
  } else if(integration === 'box') {
    return 'Box';
  }
}

export function successfulIntegration(integration) {
  const provider = selectProvider(integration);

  return {
    message: 'Successful Integration',
    description: `You have successfully authorized ${provider} access.`,
    icon: <Icon type="check" style={{ color: '#00a854' }} />,
    duration: 4,
  };
}

export function badIntegration(integration, status) {
  const provider = selectProvider(integration);
}
