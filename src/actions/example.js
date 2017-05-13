import messaging, { EventTypes } from './messaging';

function myEventListener(eventType, event) {
   // console.log(`TT: myEventListener(${eventType}, ${JSON.stringify(event)})`);
   // console.log("HELLO");
   	switch(eventType) {
   		case "specificEventType" : {
   			console.log(`TT: myEventListener(${eventType}, ${JSON.stringify(event)})`);
   		}

   	}
}

export default function example() {
	messaging().addEventListener(myEventListener);
}

// export default function example(param) {
// 	switch(param) {
// 		case null : {
// 			messaging().addEventListener(null);
// 			console.log("Sleeping");
// 		}
// 		case "listening" : {
// 			messaging().addEventListener(myEventListener);	
// 			console.log("Listening");
// 		}
// 	}
// }
