import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../actions";
import FlatButton from 'material-ui/FlatButton';
import { Card } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import { green600 } from 'material-ui/styles/colors';

class VerifyAccount extends Component {

  componentDidMount() {
    console.log(this.props)
    const uuid = this.props.match.params.uuid; //we get uuid from url params
    this.props.verifyEmailAccount(uuid);
  }

  render() {
    console.log(this.props.email)
    const { mainDiv, flexDiv, cardDivStyle, cardStyle } = inlineStyles;

    return (
      <div style={mainDiv}>
        <div className="container">
          <div className={`col-xs-12 col-md-offset-3 col-md-6`}>
            <div className="flipper" style={flexDiv}>
              {
                !this.props.email ?
                  <div className="col-xs-12 text-center">
                    <CircularProgress size={100} thickness={7} />
                  </div> :
                  <div style={{width: '100%'}}>
                    <Card style={cardStyle}>
                      <div style={cardDivStyle}>
                        <FontIcon className="material-icons" style={{ fontSize: '140px' }} color={green600}>check_circle</FontIcon>
                      </div>
                      <div className="text-center" style={{ paddingTop: '20px' }}>
                        <h2>Email Verified!</h2>
                        <FlatButton type="button" label="Cleck here to create your account" primary={true} onTouchTap={() => { this.props.history.push('/createAccount') }} />
                      </div>
                    </Card>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const inlineStyles = {
  mainDiv: {
    minHeight: '100vh',
    backgroundColor: '#EDF0F1'
  },
  flexDiv: {
    display: 'flex',
    minHeight: '100%',
    minHeight: '100vh',
    alignItems: 'center'
  },
  cardStyle: {
    padding: '0 20px 12px'
  },
  cardDivStyle: {
    textAlign: 'center',
    padding: '24px 0px 10px'
  }
}

function mapStateToProps(state) {
  return {
    email: state.registerReducer.email
  }
}


export default connect(mapStateToProps, actions)(VerifyAccount)
