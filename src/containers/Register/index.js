import React, { Component } from "react";
import { Card } from 'material-ui/Card';
import RegisterForm from "./RegisterForm";
import styles from "./styles.scss";
import cssModules from "react-css-modules";

class Register extends Component {
  render() {
    const { mainDiv, cardStyle, containerDiv } = inlineStyles;

    return (
      <div style={mainDiv}>
        <div style={containerDiv}>
          <div style={{ width: '100%' }}>
            <Card style={cardStyle}>
              <RegisterForm />
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

const inlineStyles = {
  mainDiv: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#EDF0F1'
  },
  cardStyle: {
    padding: '0 20px 12px'
  },
  containerDiv: {
    maxWidth: '450px',
    minWidth: '436px',
    minHeight: '100%',
    minHeight: '100vh',
    alignItems: 'center',
    display: 'flex',
    padding: '20px'
  }
}

export default cssModules(Register, styles, { allowMultiple: true });
