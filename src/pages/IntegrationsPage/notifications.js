function selectProvider(integration) {
  if (integration === 'google') {
    return 'Google Drive';
  } else if (integration === 'box') {
    return 'Box';
  }
}

export function successfulIntegration(integration) {
  const provider = selectProvider(integration);

  return {
    message: 'Successful Integration',
    description: `You have successfully authorized ${provider} access.`,
    duration: 4
  };
}

export function badIntegration({ integration, status }) {
  const provider = selectProvider(integration);

  if (status === 'FORBIDDEN') {
    return {
      message: 'Something Wrong',
      description: `You did not authorize ${provider} access`,
      duration: 4,
    };
  } else if (status === 'NOT_FOUND') {
    return {
      message: 'Something Wrong',
      description: 'You don\'t have permission to do add a provider',
      duration: 4,
    };
  }

  return {
    message: 'Something Wrong',
    description: 'We were unable to add your provider',
    duration: 4
  };
}
