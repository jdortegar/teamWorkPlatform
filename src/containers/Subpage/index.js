import { object, bool, func } from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestSubpageData } from '../../actions';
import Spinner from '../../components/Spinner';
import meta from './meta.json';
import Subpage from '../../views/Subpage';

class SubpageContainer extends Component {
   static propTypes = {
      subpageData: object,
      requestSubpageData: func.isRequired,
      isFetching: bool
   };

   static defaultProps = {
      subpageData: {},
      isFetching: true
   };

   componentDidMount() {
      this.props.requestSubpageData();
   }

   subpageContent = () => {
      if (this.props.isFetching) {
         return <Spinner />;
      }
      return <Subpage data={this.props.subpageData} meta={meta} />;
   }

   render() {
      return (
         <div>{this.subpageContent()}</div>
      );
   }
}

const mapStateToProps = state => ({
   isFetching: state.subpageReducer.isFetching,
   subpageData: state.subpageReducer.items
});

const mapDispatchToProps = dispatch => bindActionCreators({
   requestSubpageData
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SubpageContainer);
