import React from "react";
import { Card } from 'material-ui/Card';
import styles from "./styles.scss";
import cssModules from "react-css-modules";

const SignUp = (props) => {
  const { mainDiv, cardStyle, containerDiv } = inlineStyles;

  return (
    <div style={mainDiv}>
      <div className="cool-habla" style={containerDiv}>
        <div style={{ width: '100%' }}>
          <Card style={cardStyle}>
            {props.children}
          </Card>
        </div>
      </div>
    </div>
  );
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
    maxWidth: '520px',
    width: '100%',
    minWidth: '360px',
    minHeight: '100%',
    minHeight: '100vh',
    alignItems: 'center',
    display: 'flex',
    padding: '20px'
  }
}

export default cssModules(SignUp, styles, { allowMultiple: true });
