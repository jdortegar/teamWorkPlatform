/* eslint-disable no-console */
import IO from 'socket.io-client';
import SocketIOWildcard from 'socketio-wildcard';
import EventTypes from '../common-hablaai/EventTypes';

class Messaging {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.eventListeners = new Set();
    this.onlineOfflineListeners = new Set();
    this.unauthorizedListeners = new Set();
    this.connectionListenersInitialized = false;
    this.verbose = false;
  }

  /**
   * Refer to repository hablaapi/src/services/messaging/messagingService#EventTypes for valid event types.
   *
   * @param listener Callback function that accepts a two parameter of eventType, and event json.
   */
  addEventListener(listener) {
    this.eventListeners.add(listener);
  }

  removeEventListener(listener) {
    this.eventListeners.delete(listener);
  }

  /**
   * Make sure to retrieve missed messages.  (ex. /conversations/{conversationId}/getTranscript?since=2017-05-07T06:14:30Z)
   *
   * @param listener Callback function that accepts a single parameter of true (online) or false (offline).
   */
  addOnlineOfflineListener(listener) {
    this.onlineOfflineListeners.add(listener);
  }

  removeOnlineOfflineListener(listener) {
    this.onlineOfflineListeners.delete(listener);
  }

  /**
   * Redirect user to login page perhaps?
   *
   * @param listener
   */
  addUnauthorizedListener(listener) {
    this.unauthorizedListeners.add(listener);
  }

  removeUnauthorizedListener(listener) {
    this.unauthorizedListeners.delete(listener);
  }

  setVerbose(verbose = true) {
    this.verbose = verbose;
  }

  initializeConnectionListeners() {
    if (!this.connectionListenersInitialized) {
      this.socket.on('unauthorized', error => {
        if (this.verbose) {
          console.log(`Messaging unauthorized.  ${JSON.stringify(error)}`);
        }

        if (error.data.type === 'UnauthorizedError' || error.data.code === 'invalid_token') {
          if (this.verbose) {
            console.log("User's token has expired");
          }

          this.notifyUnauthorizedListeners();
        }
      });

      this.socket.on('reconnect_failed', a => {
        if (this.verbose) {
          console.log(`\n\t\t\tMessaging reconnect_failed: a=${a}  [${new Date()}]`);
        }
      });
      this.socket.on('reconnect', attemptNumber => {
        if (this.verbose) {
          console.log(`\n\t\t\tMessaging reconnect: attemptNumber=${attemptNumber}  [${new Date()}]`);
        }
      });
      this.socket.on('connect_error', err => {
        if (this.verbose) {
          console.log(`\n\t\t\tMessaging connect_error: ${JSON.stringify(err)}  [${new Date()}]`);
        }
        this.notifyOnlineOfflineListener(false);
      });
      this.socket.on('reconnect_error', err => {
        if (this.verbose) {
          console.log(`\n\t\t\tMessaging reconnect_error: ${JSON.stringify(err)}  [${new Date()}]`);
        }
      });
      this.socket.on('connect_timeout', () => {
        if (this.verbose) {
          console.log(`\n\t\t\tMessaging connect_timeout: [${new Date()}]`);
        }
      });
      this.socket.on('error', err => {
        if (this.verbose) {
          console.log(`\n\t\t\tMessaging error: ${JSON.stringify(err)}  [${new Date()}]`);
        }
      });
      this.socket.on('ping', () => {
        if (this.verbose) {
          console.log(`\n\t\t\tMessaging ping  [${new Date()}]`);
        }
      });
      this.socket.on('pong', ms => {
        if (this.verbose) {
          console.log(`\n\t\t\tMessaging pong (${ms}ms)  [${new Date()}]`);
        }
      });

      this.socket.on('*', payload => {
        const eventType = payload.data[0];
        const event = payload.data[1];

        if (eventType !== 'authenticated') {
          if (this.verbose) {
            console.log(
              `\n\t\t\tMessaging received eventType=${eventType}  event=${JSON.stringify(event)}  [${new Date()}]`
            );
          }

          this.notifyEventListeners(eventType, event);
        }
      });

      this.connectionListenersInitialized = true;
    }
  }

  notifyEventListeners(eventType, event) {
    let accepted = false;
    this.eventListeners.forEach(listener => {
      accepted = listener(eventType, event) || accepted;
    });
    if (!accepted) {
      console.warn(`Unprocessed messaging eventType=${eventType}`);
    }
  }

  notifyOnlineOfflineListener(online) {
    this.onlineOfflineListeners.forEach(listener => listener(online));
  }

  notifyUnauthorizedListeners() {
    this.unauthorizedListeners.forEach(listener => listener());
  }

  connect(jwt) {
    this.close(); // If connection exists, close it.

    return new Promise(resolve => {
      this.socket = new IO(this.url);
      const wildcardPatch = new SocketIOWildcard(IO.Manager);
      wildcardPatch(this.socket);

      this.socket.on('connect', () => {
        if (this.verbose) {
          console.log(`\n\t\t\tMessaging connected.  [${new Date()}]`);
        }
        this.socket.emit('authenticate', { token: jwt });

        if (!this.connectionListenersInitialized) {
          this.socket.on('authenticated', () => {
            if (this.verbose) {
              console.log(`\n\t\t\tMessaging authenticated.  [${new Date()}]`);
            }

            this.notifyOnlineOfflineListener(true);
            resolve();
          });
        }

        this.initializeConnectionListeners();
      });
    });
  }

  typing(conversationId, isTyping) {
    this.socket.send(EventTypes.typing, { conversationId, isTyping });
  }

  location(lat, lon, alt = undefined, accuracy = undefined) {
    this.socket.send(EventTypes.location, { lat, lon, alt, accuracy });
  }

  close() {
    if (this.socket) {
      this.notifyOnlineOfflineListener(false);
      this.socket.close();
      this.socket = undefined;
      this.connectionListenersInitialized = false;
    }
  }
}

let messagingInstance;

export default function messaging(websocketUrl = undefined) {
  if (messagingInstance === undefined && websocketUrl) {
    let url = websocketUrl;
    const urlToks = websocketUrl.split(':');
    if (urlToks.length <= 2) {
      if (websocketUrl.toLowerCase().startsWith('https:')) {
        url += ':443';
      } else {
        url += ':80';
      }
    }
    messagingInstance = new Messaging(url);
  }
  return messagingInstance;
}
