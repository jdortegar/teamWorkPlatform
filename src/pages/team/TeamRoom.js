import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import MessageContainer from './components/MessageContainer';
import Helper from '../../components/Helper';
import BreadCrumb from '../../components/BreadCrumb';
import axios from 'axios';
import config from '../../config/env';
import { getPosts } from '../../actions/index';
import Perf from 'react-addons-perf';
import LeftNav from './components/LeftNav';
import LogedHeader from '../../components/LogedHeader';

class TeamRoom extends Component {

	render() {
		const items=[];
		items.push({'team rooms':'/teams'});
		const key = this.props.room.name;
		let obj = {};
		obj[key] = '#';
		items.push(obj)
		return (
			<div className="row">
				<LogedHeader />
				<BreadCrumb items={items} />
				{/*
				<div className="row teamroom-body-nav">
					<div className="teamroom-body-nav-links">
						<Link to="/teams" className="teamroom-body-nav-link passive">TEAM ROOMS</Link>
						<i className="fa fa-chevron-right teamroom-body-nav-link" />
						<Link to="/#" className="teamroom-body-nav-link active">{this.props.room.name.toUpperCase()}</Link>
					</div>
				</div>
				*/}

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
	