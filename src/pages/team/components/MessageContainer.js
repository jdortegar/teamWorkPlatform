import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { FieldGroup } from '../../../components';
import Post from './Post';
import autosize from 'autosize';
import ShortName from './ShortName';
import axios from 'axios';
import { getPosts } from '../../../actions/index';
import config from '../../../config/env';
import io from 'socket.io-client';
import messaging, { EventTypes } from '../../../actions/messaging';
import moment from 'moment-timezone';


class MessageContainer extends Component {
	static contextTypes = {
		router: PropTypes.object
	};
	constructor(props) {
		super(props);
		this.state={posts: [], content: '', key: -1}; //key for refresh textarea after each enter since value of key will changed every time textarea changed value and enter
		this.handleKeyPressed = this.handleKeyPressed.bind(this);
		this.displayAllPosts = this.displayAllPosts.bind(this);
		this.translateData = this.translateData.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.rawMessages =[];
		this.renderPosts = [];
		this.members=[];
		this.myEventListener = this.myEventListener.bind(this);
		this.memberName = this.memberName.bind(this);
		this.addRealTimeThreaded = this.addRealTimeThreaded.bind(this);
		
	}

	memberName(memberId) {
		var name = ""
		this.members.map(member => {
			if (member.userId == memberId) {
				name = member.displayName; //TODO : figure out why I can't return here?
			}
		});
		return name;
	}

	addRealTimeThreaded(family,node) {
		//<Post >  ...: key, props : { children : [], color, content, id, level, shortname, time}
		//this method traverse the tree of Post to find parent of "node" in "family"

		
		family.map(parent => {
			if (node.replyTo == parent.props.id) {
				var shortname = ShortName(this.memberName(node.createdBy));
				parent.props.children.push(
					<Post 
						id={node.messageId} 
						key={node.messageId} 
						shortname={shortname} 
						level={parent.props.level+1} 
						color="" 
						content={node.text} 
						time={node.created}
						children={[]}
					/>
				)
				return;
			}
			else if (parent.props.children.length > 0) this.addRealTimeThreaded(parent.props.children, node);

		})
	}

	myEventListener(eventType, event) {
		// console.log(event);
		switch (eventType) {
			case EventTypes.messageCreated : {
				if (event.createdBy != this.props.user.user.userId) {  //only add to post if receive message from other user, since current user already added post by local addChild

					// conversationId:"ea794510-cea6-4132-0023-a7ae1d32abb5"
					// created:"2017-05-12T23:25:35Z"
					// createdBy:"ea794510-cea6-4132-0000-aa8e1d32abb5"
					// messageId:"ce2b553d-d928-4e53-8e01-a6e17d224d5f"
					// messageType:"text"
					// text:"Test again"

					if (!event.hasOwnProperty("replyTo")) {
						// console.log(event.createdBy);
						var shortname = ShortName(this.memberName(event.createdBy));
						
						this.renderPosts.push(
							<Post 
								id={event.messageId} 
								key={event.messageId} 
								shortname={shortname} 
								level={0} 
								color="" 
								content={event.text} 
								time={moment(event.created).add(1, 'day').format('LLL')}
								children={[]}
							/>
						)
						this.setState({posts: this.renderPosts});
					}
					else {
						this.addRealTimeThreaded(this.renderPosts,event);
						this.setState({posts: []}); //when a sub thread added to parent, this.state.posts has not changed in shallow level, it changed in deep lvl, so DOM not be re-render
						//that method force change value for posts and change back to this.renderPosts to force re-render all posts
						this.setState({posts: this.renderPosts});
				
					}
				}
			}
		}
	}

	componentWillMount() {
		const teamRoomId = this.props.room.teamRoomId;
		const url = `${config.hablaApiBaseUri}/teamRooms/getMembers/${teamRoomId}`;
        this.token = `Bearer ${this.props.user.token}`;
        axios.get(url, { headers: { Authorization: this.token } })
        .then( response => {
        	this.members = response.data.teamRoomMembers;
        })
  
       	const urlCon = `${config.hablaApiBaseUri}/conversations/getConversations?teamRoomId=${teamRoomId}`;    
   		axios.get(urlCon, { headers : { Authorization: this.token}})
   		.then(response => {
   			// console.log(response);
   			const conversations = response.data.conversations;
   			// console.log(conversations);
   			this.conId = conversations[0].conversationId;
   			const urlTranscript = `${config.hablaApiBaseUri}/conversations/getTranscript/${this.conId}`;
            axios.get(urlTranscript, { headers: { Authorization: this.token } })
            .then( (responseTranscript) => {
                this.translateData(responseTranscript.data.messages);      	
            })
   		})
	}

	sendMessage(text,replyTo,shortname) {
		const url = `${config.hablaApiBaseUri}/conversations/${this.conId}/createMessage`;
        let body;
        if (replyTo) body = { messageType: "text", text, replyTo };
        else body = { messageType: "text", text };
        const headers = {
        	content_type: 'application/json',
            Authorization: this.token
        };
        axios.post(url, body, { headers })
        .then( (response) => {

        	const message = response.data.message;
        	this.renderPosts.push(	
				<Post 
					id={message.messageId}
					key={message.messageId} 
					shortname={shortname}
					level={0} 
					color=""
					content={message.text} 
					time={moment(message.created).add(1, 'day').format('LLL')}
					children={[]}
				/>
			);
        	this.setState({content: '', key: -this.state.key});
        	// console.log(response.data.message);  // { conversationId, created, createdBy, messageId, messageType, text }  
        })   
	}

	translateData(messages) {	//TODO : reduce time by skipping translateData
		// console.log(messages);
  		var findDepth = function(message) {
  			if (!message.hasOwnProperty("replyTo")) 
  				message["depth"] = 0;
  			else {
  				var depth = 0;
  				var clone = message;
  				while (clone.hasOwnProperty("replyTo")) {
  					messages.map( m => {
  						if (clone.replyTo == m.messageId) { 
  							clone = m;
  							depth = depth+1;
  							return;
  						}
  					})
  				}
  				message["depth"] = depth;
  			}
  		}
		messages.map(message => {
			this.members.map(member => {
				
				if (message.createdBy == member.userId) {
					message["from"] = ShortName(member.displayName);
				}
			});
			message["time"] = message.created;
			message["child"] = [];
			findDepth(message);
		});
		this.rawMessages = messages;  //assign data messages to reducer_posts
		this.displayAllPosts();
	}

	scrollToBottom = () => {
    	const node = ReactDOM.findDOMNode(this.refs.end);
    	node.scrollIntoView({behavior: "smooth"});
	}

   

	componentDidMount() {
	    this.scrollToBottom();
	    autosize(document.querySelectorAll('textarea'));
	    messaging().addEventListener(this.myEventListener);
	}

	componentDidUpdate() {
	    this.scrollToBottom();
	    autosize(document.querySelectorAll('textarea'));
	}

	handleKeyPressed(target) {		
		if (target.charCode==13 && target.shiftKey==false) {
			this.addChild();
		}
	}

	addChild() {
		var msg = this.state.content;
		// const shortname = "SD";
		const shortname = ShortName(this.props.user.user.displayName);
		if (msg != "") {
			if (msg.replace(/ /g,'') != "") {
				this.sendMessage(msg,"",shortname);
			}
			else {
				this.setState({key: -this.state.key, content:''});
			}
		}
		else {
			this.setState({key: -this.state.key, content:''});
		}
	}

	displayAllPosts() {		
		this.rawMessages.map((post) =>  {
			if (post.hasOwnProperty('replyTo')) {
				this.rawMessages.map((parent) => {	
					if (parent.messageId == post["replyTo"]) {
						parent.child.push(
							<Post
								id={post["messageId"]}
								key={post["messageId"]}
								shortname={post["from"]}
								level={parent.depth+1 }
								color={post["color"]}
								content={post["text"]}
								time={moment(post["time"]).add(1, 'day').format('LLL')}
								children={post["child"]} ////1
							/>
						)
						return; //skip the loop when loop can find a parent of a child
					}	
				});
			}
			else {
				this.renderPosts.push(
					<Post 
						id={post["messageId"]} 
						key={post["messageId"]} 
						shortname={post["from"]} 
						level={0} 
						color={post["color"]} 
						content={post["text"]} 
						time={moment(post["time"]).add(1, 'day').format('LLL')}
						children={post["child"]}
					/>
				)
			}
		});
		this.setState({posts : this.renderPosts});
	}

	render() {
		return (
			<div className="row teamroom-lobby" id="lobby">
				<div className="row teamroom-seperator-line">
					<div className="col-md-5 col-xs-0 date-item line-break">
						&nbsp;
					</div>
					<div className="col-md-2 col-xs-12 date-item chat-date">
						Today
					</div>
					<div className="col-md-5 col-xs-0 date-item line-break">
						&nbsp;
					</div>
				</div>					
					{this.state.posts}
									
				<div ref="end"></div>
				<div className="row">
					<form>
						<textarea 
							className="user-input" 
							placeholder="What you want to tell your team..." 
							onKeyPress={this.handleKeyPressed} 
							onChange={event => this.setState({content: event.target.value})} 
							key={this.state.key} 
						/>
					</form>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		reducer_posts: state.messages.posts,
		user: state.user.user,
		room: state.room.room
	};
}

export default connect(mapStateToProps, {getPosts})(MessageContainer);

// conversations = [ {conversationId:"dfsdf", participants: [{country:"US", displayName: "Rob", icon: null, lastName: "Abbott", preferences : {}, timeZone: "America/Los_Angeles", userId: "sdfsdfds"},{},{}] },{...}]

