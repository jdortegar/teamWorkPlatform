import IO from 'socket.io-client';
import SocketIOWildcard from 'socketio-wildcard';

export const EventTypes = Object.freeze({
   presenceChanged: 'presenceChanged',
   userInvited: 'userInvited',
   userCreated: 'userCreated',
   userUpdated: 'userUpdated',
   userPrivateInfoUpdated: 'userPrivateInfoUpdated',
   subscriberOrgCreated: 'subscriberOrgCreated',
   subscriberOrgUpdated: 'subscriberOrgUpdated',
   subscriberOrgPrivateInfoUpdated: 'subscriberOrgPrivateInfoUpdated',
   subscriberAdded: 'subscriberAdded',
   subscriberRemoved: 'subscriberRemoved',
   teamCreated: 'teamCreated',
   teamUpdated: 'teamUpdated',
   teamPrivateInfoUpdated: 'teamPrivateInfoUpdated',
   teamMemberAdded: 'teamMemberAdded',
   teamMemberRemoved: 'teamMemberRemoved',
   teamRoomCreated: 'teamRoomCreated',
   teamRoomUpdated: 'teamRoomUpdated',
   teamRoomPrivateInfoUpdated: 'teamRoomPrivateInfoUpdated',
   teamRoomMemberAdded: 'teamRoomMemberAdded',
   teamRoomMemberRemoved: 'teamRoomMemberRemoved',
   conversationCreated: 'conversationCreated',
   conversationUpdated: 'conversationUpdated',
   messageCreated: 'messageCreated',
   typing: 'typing',
   location: 'location',
   from(value) { return (this[value]); }
});


export class Messaging {
   url;
   socket;

   eventListeners = new Set();
   onlineOfflineListeners = new Set();
   unauthorizedListeners = new Set();

   connectionListenersInitialized = false;

   verbose = false;

   constructor(url) {
      this.url = url;
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


   _verbose(verbose = true) {
      this.verbose = verbose;
   }

   _initializeConnectionListeners() {
      if (!this.connectionListenersInitialized) {
         this.socket.on('unauthorized', (error) => {
            if (this.verbose) {
               console.log(`Messaging unauthorized.  ${JSON.stringify(error)}`);
            }

            if ((error.data.type === 'UnauthorizedError') || (error.data.code === 'invalid_token')) {
               if (this.verbose) {
                  console.log("User's token has expired");
               }

               this._notifyUnauthorizedListeners();
            }
         });

         this.socket.on('reconnect_failed', (a) => {
            if (this.verbose) {
               console.log(`\n\t\t\tMessaging reconnect_failed: a=${a}  [${new Date()}]`);
            }
         });
         this.socket.on('reconnect', (attemptNumber) => {
            if (this.verbose) {
               console.log(`\n\t\t\tMessaging reconnect: attemptNumber=${attemptNumber}  [${new Date()}]`);
            }
         });
         this.socket.on('connect_error', (err) => {
            if (this.verbose) {
               console.log(`\n\t\t\tMessaging connect_error: ${JSON.stringify(err)}  [${new Date()}]`);
            }
            this.notifyOnlineOfflineListener(false);
         });
         this.socket.on('reconnect_error', (err) => {
            if (this.verbose) {
               console.log(`\n\t\t\tMessaging reconnect_error: ${JSON.stringify(err)}  [${new Date()}]`);
            }
         });
         this.socket.on('connect_timeout', () => {
            if (this.verbose) {
               console.log(`\n\t\t\tMessaging connect_timeout: [${new Date()}]`);
            }
         });
         this.socket.on('error', (err) => {
            if (this.verbose) {
               console.log(`\n\t\t\tMessaging error: ${JSON.stringify(err)}  [${new Date()}]`);
            }
         });
         this.socket.on('ping', () => {
            if (this.verbose) {
               console.log(`\n\t\t\tMessaging ping  [${new Date()}]`);
            }
         });
         this.socket.on('pong', (ms) => {
            if (this.verbose) {
               console.log(`\n\t\t\tMessaging pong (${ms}ms)  [${new Date()}]`);
            }
         });

         this.socket.on('*', (payload) => {
            const eventType = payload.data[0];
            const event = payload.data[1];

            if (eventType !== 'authenticated' ) {
               if (this.verbose) {
                  console.log(`\n\t\t\tMessaging received eventType=${eventType}  event=${JSON.stringify(event)}  [${new Date()}]`);
               }

               this._notifyEventListeners(eventType, event);
            }
         });

         this.connectionListenersInitialized = true;
      }
   }

   _notifyEventListeners(eventType, event) {
      this.eventListeners.forEach(listener => listener(eventType, event));
   }

   _notifyOnlineOfflineListener(online) {
      this.onlineOfflineListeners.forEach(listener => listener(online));
   }

   _notifyUnauthorizedListeners() {
      this.unauthorizedListeners.forEach(listener => listener());
   }

   connect(jwt) {
      this.close(); // If connection exists, close it.

      return new Promise((resolve, reject) => {
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


                  if (this.onlineOfflineListener) {
                     this.onlineOfflineListener(true);
                  }
                  resolve();
               });
            }

            this._initializeConnectionListeners();
         });
      });
   }


   typing(conversationId, isTyping) {
      this.socket.send(EventTypes.typing, { conversationId, isTyping });
   }

   location(lat, lon, alt = undefined) {
      this.socket.send(EventTypes.location, { lat, lon, alt });
   }

   close() {
      if (this.socket) {
         this.socket.close();
         this.socket = undefined;
         this.connectionListenersInitialized = false;
      }
   }
}


let messagingInstance;

export default function messaging(websocketUrl = undefined) {
   if ((messagingInstance === undefined) && (websocketUrl)) {
      let url = websocketUrl;
      const urlToks = websocketUrl.split(':');
      if (urlToks.length <= 2) {
         if (websocketUrl.toLowerCase().startsWith('https:')) {
            url += ':443';
         } else {
            url += ":80";
         }
      }
      messagingInstance = new Messaging(url);
   }
   return messagingInstance;
}
