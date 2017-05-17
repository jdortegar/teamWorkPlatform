import React, { Components } from 'react';
import { connect } from 'react-redux';

class LeftNav extends Components {
  constructor(props) {
    super(props);
    this.state = {membersStatus : {}};
    this.members = [];
  }

  componentWillMount() {
    this.members = this.props.members;
    this.members.map(member => {
      this.setState({membersStatus[member.memberId] = "member-status-away"});
    })
  }
  
  statusChanged (event) {
    this.setState({membersStatus[event.memberId] = `member-status-${event.presence}`})
  }

  render() {
    return (
      {
        this.members.map(member => {
          return (
            <div className={this.state.membersStatus[member.memberId]}>
              <img src={member.icon} />{member.displayName}
            </div>
          )
        })
      }
    )
  }
}

function mapStateToProps(state) {
  return {
    members : state.members.members
  }
}

export default connect(mapStateToProps, null)(LeftNav);

/*
.member-status-away {
  img {
      width: 25px;
      height: 25px;
-webkit-filter: grayscale(100%);
   -moz-filter: grayscale(100%);
     -o-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
        filter: grayscale(100%);
  }
  p {
    color: grey;
    font-style: italic;
    font-size: 14px;
 }
}
.member-status-available {
  img {
      width: 25px;
      height: 25px;
  }
  p {
    color: black;
    font-weight: bold;
    font-size: 14px;
 }
}



*/
