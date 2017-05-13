import React from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap/lib';
//delheight
const FieldGroup = ({classheight, classn, id, label, help, ...props}) => {
	return (
		<FormGroup controlId={id} className={classn}>
			<ControlLabel className={classheight}>{label}</ControlLabel>
			<FormControl {...props} />
			<HelpBlock>{help}</HelpBlock>
		</FormGroup>
	);
}

export { FieldGroup };