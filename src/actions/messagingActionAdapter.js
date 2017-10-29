import EventTypes from '../common-hablaai/EventTypes';

const eventHandler = (eventType, event) => {
  switch (eventType) {
    case EventTypes.boxIntegrationCreated:
      // TODO;
      break;
    case EventTypes.boxIntegrationExpired:
      // TODO:
      break;
    case EventTypes.boxIntegrationRevoked:
      // TODO:
      break;
    case EventTypes.googleIntegrationCreated:
      // TODO;
      break;
    case EventTypes.googleIntegrationExpired:
      // TODO:
      break;
    case EventTypes.googleIntegrationRevoked:
      // TODO:
      break;

    default:
      return false;
  }
  return true;
};

export default eventHandler;
