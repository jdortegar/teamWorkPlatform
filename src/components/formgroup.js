import React from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

const FieldGroup = ({classn, id, label, help, ...props}) => {
	return (
		<FormGroup controlId={id} className={classn}>
			<ControlLabel className="delheight">{label}</ControlLabel>
			<FormControl {...props} />
			<HelpBlock>{help}</HelpBlock>
		</FormGroup>
	);
}

export default FieldGroup;