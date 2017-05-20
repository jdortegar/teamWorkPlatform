import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { FieldGroup } from '../../../components';
import Post from './Post';
import autosize from 'autosize';
import axios from 'axios';
import { saveMembersTeamRoom } from '../../../actions/index';
import config from '../../../config/env';
import io from 'socket.io-client';
import messaging, { EventTypes } from '../../../actions/messaging';
import moment from 'moment-timezone';
import Helper from '../../../components/Helper';


class MessageContainer extends Component {

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
		this.addRealTimeThreaded = this.addRealTimeThreaded.bind(this);
		this.membersConnectionListener = this.membersConnectionListener.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
	}

	componentWillMount() {
		const helper = new Helper(this.props.user);
		const teamRoomId = this.props.room.teamRoomId;
		helper.getTeamRoomMembers(teamRoomId)
		.then(result => {
			this.members = result;
			this.members.map(member => {
		    	const key = member.userId;
		    	if (key == this.props.user.user.userId) this.state[key] = "member-status-available";
		    	else this.state[key] = "member-status-away";
		    })
		})
		helper.getMessages(teamRoomId)
		.then(response => {
			this.translateData(response); 
		})
	}

	componentDidMount() {
	    this.scrollToBottom();
	    autosize(document.querySelectorAll('textarea'));

//This is use for offline edit teamroom page only => bypass login and teams page
	    messaging(this.props.user.websocketUrl).connect(this.props.user.token)
		.then(() => {
			console.log("connect successfully!");
		});
	    messaging().addEventListener(this.myEventListener);
	    // messaging().addOnlineOfflineListener(this.membersConnectionListener);

	}

	componentDidUpdate() {
	    this.scrollToBottom();
	    autosize(document.querySelectorAll('textarea'));
	}

	membersConnectionListener(online) {
		// console.log(`AD: online=${online}`);
	}

	addRealTimeThreaded(family,node) {
		//<Post >  ...: key, props : { children : [], color, content, id, level, shortname, time}
		//this method traverse the tree of Post to find parent of "node" in "family"
		family.map(parent => {
			if (node.replyTo == parent.props.id) {
				var shortname = Helper.getShortName(Helper.getMemberName(this.members,node.createdBy));
				parent.props.children.push(
					<Post 
						id={node.messageId} 
						key={node.messageId} 
						shortname={shortname} 
						name={Helper.getMemberName(this.members,node.createdBy)}
						level={parent.props.level+1} 
						icon={Helper.getMemberIcon(this.members,node.createdBy)}
						color="" 
						content={node.text} 
						time={moment(node.created).fromNow()}
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
						var shortname = Helper.getShortName(Helper.getMemberName(this.members,event.createdBy));
						
						this.renderPosts.push(
							<Post 
								id={event.messageId} 
								key={event.messageId} 
								shortname={shortname} 
								name={Helper.getMemberName(this.members, event.createdBy)}
								level={0} 
								color="" 
								icon={Helper.getMemberIcon(this.members, event.createdBy)}
								content={event.text} 
								time={moment(event.created).fromNow()}
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
			case EventTypes.presenceChanged : {
				const key = event.userId;
    			this.state[key] = `member-status-${event.presenceStatus}`;
    			this.forceUpdate();
				// trackingMembersStatus(this.members,event)
				// address:"::ffff:127.0.0.1"
				// presenceStatus:"available"/"away"
				// userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
				// userId:"ea794510-cea6-4132-ae22-a7ae1d32abb5"

			}
		}
	}


	sendMessage(text,replyTo,shortname,name) {
		helper.getResponseMessage(this.props.room.teamRoomId,text, replyTo)
		.then(response => {
			const message = response.data.message;
        	this.renderPosts.push(	
				<Post 
					id={message.messageId}
					key={message.messageId} 
					shortname={shortname}
					name={name}
					level={0} 
					color=""
					icon={Helper.getMemberIcon(this.members, message.createdBy)}
					content={message.text} 
					time={moment(message.created).fromNow()}
					children={[]}
				/>
			);
        	this.setState({content: '', key: -this.state.key});
		})  
	}

	translateData(messages) {	//TODO : reduce time by skipping translateData
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
					message["from"] = Helper.getShortName(member.displayName);
					message["icon"] = member.icon == null ? null : "data:image/jpg;base64," + member.icon;
				}
			});
			message["name"] = Helper.getMemberName(this.members,message.createdBy);
			message["time"] = message.created;
			message["child"] = [];
			findDepth(message);
		});
		this.rawMessages = messages;  
		this.displayAllPosts();
	}

	scrollToBottom = () => {
    	const node = ReactDOM.findDOMNode(this.refs.end);
    	node.scrollIntoView({behavior: "smooth"});
	}

	handleKeyPressed(target) {		
		if (target.charCode==13 && target.shiftKey==false) {
			this.addChild();
		}
	}

	addChild() {
		var msg = this.state.content;
		const shortname = Helper.getShortName(this.props.user.user.displayName);
		const name = this.props.user.user.displayName;
		if (msg != "") {
			if (msg.replace(/ /g,'') != "") {
				this.sendMessage(msg,"",shortname,name);
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
								name={post["name"]}
								icon={post["icon"]}
								level={parent.depth+1 }
								color={post["color"]}
								content={post["text"]}
								time={moment(post["time"]).fromNow()}
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
						name={post["name"]}
						level={0} 
						icon={post["icon"]}
						color={post["color"]} 
						content={post["text"]} 
						time={moment(post["time"]).fromNow()}
						children={post["child"]}
					/>
				)
			}
		});
		this.setState({posts : this.renderPosts});
	}

	render() {
		
		return (
			<div>
				<div className="teamroom-left-nav">
					<div className="teamroom-left-nav-title-status">
						Members
					</div>
					<div className="teamroom-member-status-container">
			      	{
			        	this.members.map(member => {
			        		const icon = "data:image/jpg;base64," + member.icon;
			          		const key = member.userId;
			          		const dot = this.state[key] == "member-status-away" ? "fa fa-circle dot-status-yellow" : "fa fa-circle dot-status-green";
			          		return (
			            		<div className={this.state[key]} key={key}>
				            		<i className={dot} />
				              		<img src={icon} className="" ></img>
				              		<span className="member-status-name"> {member.displayName}</span>
			            		</div>
			          		)
			        	})
			      	}
			      	</div>
	   			</div>
				<div className="row teamroom-lobby" id="lobby">
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
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user.user,
		room: state.room.room
	};
}

export default connect(mapStateToProps, {saveMembersTeamRoom})(MessageContainer);

// conversations = [ {conversationId:"dfsdf", participants: [{country:"US", displayName: "Rob", icon: null, lastName: "Abbott", preferences : {}, timeZone: "America/Los_Angeles", userId: "sdfsdfds"},{},{}] },{...}]

