import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import MessageContainer from './components/MessageContainer';
import BreadCrumb from '../../components/BreadCrumb';
import axios from 'axios';
import config from '../../config/env';
import { getPosts } from '../../actions/index';
import LoggedHeader from '../../components/LoggedHeader';

class TeamRoom extends Component {

	render() {
		const items=[];
		items.push({'team rooms':'/teams/:team'});  //TODO: fix this link path so that it can go back to select
		let obj = {};
		obj[this.props.room.name] = '#';
		items.push(obj)
		return (
			<div className="row">
				<LoggedHeader />
				<BreadCrumb items={items} />
				<MessageContainer />
				 {/*since message.connect called at messagecontainer, to use messaging in LeftNav, it should be called after messagecontainer*/}

			</div>
		);
	}
}
function mapStateToProps(state) {
	// console.log(state);
	return {
		user: state.user.user.user,
		room: state.room.room

	}
}
export default connect(mapStateToProps,{getPosts})(TeamRoom);
// <Link to="/#" className="teamroom-body-nav-link active">LOBBY</Link>
