import React, { Component } from 'react';
import autosize from 'autosize';
import { Button } from 'react-bootstrap/lib';
import { connect } from 'react-redux';
import ShortName from './ShortName';
import config from '../../../config/env';
import { sendMessage } from '../../../actions/index';
import axios from 'axios';
import moment from 'moment-timezone';

class Post extends Component {
	constructor(props) {
		super(props);
		this.state = {user_input : '', flag: 0, post:[], content: '', key: -1, displayChildren: "fa fa-minus-square-o post-header-item", children: "post-sub", extend: -1};
		this.addChild = this.addChild.bind(this);
		this.handleKeyPressed = this.handleKeyPressed.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.flag=0;
		this.manageChildren = this.manageChildren.bind(this);
	}

	componentDidUpdate() {
	    autosize(document.querySelectorAll('textarea'));
	}

	componentDidMount() {
		
	}

	


	sendMessage(text,replyTo,shortname, name) {
		const teamRoomId = this.props.room.teamRoomId;
		const token = `Bearer ${this.props.user.token}`;
		const urlCon = `${config.hablaApiBaseUri}/conversations/getConversations?teamRoomId=${teamRoomId}`;
   		axios.get(urlCon, { headers : { Authorization: token}})   		
   		.then(response => {
			const conId = response.data.conversations[0].conversationId;
			const url = `${config.hablaApiBaseUri}/conversations/${conId}/createMessage`;
	        let body;
	        if (replyTo) body = { messageType: "text", text, replyTo };
	        else body = { messageType: "text", text }; 
	        const headers = {
	        	content_type: 'application/json',
	            Authorization: token
	        };
	        axios.post(url, body, { headers })
	        .then( (response) => {
	        	const message = response.data.message;

	        	this.state.post.push(
					<Post 
						level={this.props.level+1} 
						color={this.props.color}
						icon={this.props.icon}
						children={[]}
						time={moment(message.created).fromNow()}
						content={message.text} 
						shortname={shortname} 
						name={name}
						key={message.messageId} 
						id={message.messageId}
						room={this.props.room}
						user={this.props.user} //past all props name from parent to child
					/>
				);

	            this.setState({post: this.state.post, user_input: '', key: -this.state.key});
	            this.props.children.push(
					<Post 
						level={this.props.level+1} 
						color={this.props.color}
						icon={this.props.icon}
						children={[]}
						time={moment(message.created).fromNow()}
						content={message.text} 
						shortname={shortname} 
						name={name}
						key={message.messageId} 
						id={message.messageId}
						room={this.props.room}
						user={this.props.user} //past all props name from parent to child
					/>
				);

	        })  	   	
		 })
	}

	reply() {
		return (
		<form>
			<textarea className="message-reply" onKeyPress={this.handleKeyPressed} onChange={event => this.setState({content: event.target.value})} />
		</form>
		);
	}

	handleKeyPressed(target) {		
		if (target.charCode==13 && target.shiftKey==false) {
			this.addChild();
		}
	}

	addChild() {
		const shortname = ShortName(this.props.user.user.displayName);
		const name = this.props.user.user.displayName;
		var msg = this.state.content;
		if (msg != "") {
			if (msg.replace(/ /g,'') != "") {			
				this.sendMessage(msg,this.props.id,shortname, name);
			}
			else {
				this.setState({user_input:'', key: -this.state.key});
			}
		}
		else {
			this.setState({user_input: '', key: -this.state.key});
		}
	}

	

	openReply(flag,level) {
		if (flag==0) {
			this.flag=1
			// this.setState({focus: 'active'}); //set focus before open reply
			this.setState({flag: 1, user_input: this.reply()}); 
		}
		else {
			this.flag=0;
			this.setState({flag: 0, user_input: ''});
		}
	}

	manageChildren() {
		if (this.state.extend == -1) {
			this.setState({displayChildren: "fa fa-plus-square-o post-header-item", children: "post-sub-hide", extend: -this.state.extend});
		}
		else {
			this.setState({displayChildren: "fa fa-minus-square-o post-header-item", children: "post-sub", extend: -this.state.extend});
		}
	}

	render() {
		if (this.props.children != undefined && this.props.children.length > 0 && this.state.post.length == 0) {
			this.props.children.map((child) => this.state.post.push(child));
		}
		const {level, id, color, name, shortname, time, vote, icon, content} = this.props;
		var str = level % 2 == 0 ? "row even" : "row odd"
		var self = this;
		 
		return (
			<div className={str} >
				<div className="row teamroom-container">
					<div className="row post-header">
						<i className={this.state.displayChildren} onClick={() => this.manageChildren()} />

						{ icon == null ? 
						(<div className="post-avatar post-header-item" style={{backgroundColor: color}}>
							<div>{shortname}</div>
						</div>)
						:(
							<div className="post-avatar-image post-header-item">
								<img src={icon} className="post-avatar-image post-avatar-item"></img>
							</div>
								
						)

						}
						<div className="post-header-item post-name post-avatar-item">
							{name}
						</div>
						<div className="post-header-right">
							<div className="post-header-item post-time">
								{time}
							</div>
							<div className="post-header-item post-star">
								<i className="fa fa-star-o" />
							</div>
							<div className="post-header-item post-folder">
								<i className="fa fa-folder-o" />
							</div>
						</div>
					</div>
					<div className="row post-body">
					 {/* hidden vertical voting*/}
						<div className="post-body-vote post-body-item">
							<i className="fa fa-arrow-up vote-body-item" />
							<div className="vote-number vote-body-item">
								{vote}
							</div>
							<i className="fa fa-arrow-down vote-body-item" />
						</div>


						<div className="post-content post-body-item">
							<div className="clearpadding message-content">
								{content}
							</div>
							<div className="post-footer">
								<a href="#" className="blue-link" onClick={() => this.openReply(self.flag, level)}>
									Reply
								</a>
								<div className="post-header-right">
									<i className="fa fa-thumbs-o-up vote-bottom-item" />
									<div className="vote-bottom-item">{0}</div>
									<i className="fa fa-thumbs-o-down vote-bottom-item" />
								</div>
							</div>
							<div id={id}>
								{this.state.user_input}
							</div>
							<div className={this.state.children}>
								{this.state.post}
							</div>
						</div>
					</div>
				</div>
				<div className="row post-seperator">
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user.user,
		room: state.room.room,
	}
}

export default connect(mapStateToProps,{sendMessage})(Post);

