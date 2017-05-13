import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import config from '../../../config/env';

class SendMessage extends Component {
   send(replyTo, text) {
   	const teamRoomId = this.props.room.teamRoomId;
         console.log(teamRoomId);
      const token = `Bearer ${this.props.user.token}`;
         console.log(this.token);
      const urlCon = `${config.hablaApiBaseUri}/conversations/getConversations?teamRoomId=${teamRoomId}`;
         
            axios.get(urlCon, { headers : { Authorization: this.token}})
            //Get teamroom success
            
            .then(response => {
               if (response.status == 200) {
                  // conversations = [ {conversationId:"dfsdf", participants: [{country:"US", displayName: "Rob", icon: null, lastName: "Abbott", preferences : {}, timeZone: "America/Los_Angeles", userId: "sdfsdfds"},{},{}] },{...}]
                  const conId = response.data.conversations[0].conversationId;
                  const url = `${config.hablaApiBaseUri}/conversations/${conId}/createMessage`;
                  let body;
                  if (replyTo) {
                     body = { messageType: "text", text, replyTo };
                  }
                  else {
                     body = { messageType: "text", text };
                  }
                  const headers = {
                     content_type: 'application/json',
                     Authorization: token
                  };

                  axios.post(url, body, { headers })
                  .then( (response) => {
                     // console.log(response);
                     return response;
                   })  
                  .catch(error => console.log(error))
                     }
                  })
            .catch(error => console.log(error))
   }
}

function mapStateToProps(state) {
   return {
      user: state.user.user,
      room: state.room.room
   }
}
export default connect(mapStateToProps,null)(SendMessage);

