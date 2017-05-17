import React, { Component } from 'react';
import { connect } from 'react-redux';
import messaging, { EventTypes } from '../../../actions/messaging';

class LeftNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.members = [];
    this.listenMembersStatus = this.listenMembersStatus.bind(this);
    this.statusChanged = this.statusChanged.bind(this);
  }

  componentWillMount() {
    this.setState({key: Math.random()});

  }

  listenMembersStatus(eventType, event) {
    switch (eventType) {
      case EventTypes.presenceChanged : {
        this.statusChanged(event);
      }
    }

  }

  componentDidMount() {
    messaging().addEventListener(this.listenMembersStatus);
     // this.members = this.props.members;
    console.log(this.props.members);
    this.members.map(member => {
      const key = member.userId;
      this.state[key] = "member-status-away";
    })
  }
  
  statusChanged (event) {
    const key = event.userId;
    this.state[key] = `member-status-${event.presenceStatus}`;
    this.forceUpdate();
  }

  render() {
    return (
      <div className="teamroom-left-nav">
      {
        this.members.map(member => {
          const key = member.userId;
          // var icon = "data:image/jpg;base64," + member.icon;
          return (
            <div className={this.state[key]} key={key}>
              <img src={member.icon} className="" ></img>
              {member.displayName}
            </div>
          )
        })
      }
    
    </div>
    )
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    members : state.members,
  }
}

export default connect(mapStateToProps,null)(LeftNav);

