import { connect } from 'react-redux';

import { Onboarding } from 'src/components';

const mapStateToProps = (state, props) => ({
  visible: props.visible
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Onboarding);
